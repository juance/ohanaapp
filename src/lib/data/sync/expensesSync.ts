import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { Expense } from '@/lib/types';

const EXPENSES_STORAGE_KEY = 'expenses';

/**
 * Sync local expenses data with Supabase
 * 
 * This function handles both uploading new expenses and updating existing ones
 * that were modified while offline.
 */
export const syncExpenses = async (): Promise<number> => {
  let syncedCount = 0;

  try {
    // Get all local expenses
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];

    // Find expenses with pendingSync flag
    const pendingExpenses = localExpenses.filter(expense => expense.pendingSync);

    if (pendingExpenses.length === 0) {
      console.log('No expenses to sync');
      return 0;
    }

    console.log(`Found ${pendingExpenses.length} expenses to sync`);

    // Upload each pending expense
    for (const expense of pendingExpenses) {
      // Insert expense to Supabase
      const { error } = await supabase
        .from('expenses')
        .insert({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          created_at: expense.createdAt || new Date().toISOString()
        });

      if (error) {
        console.error(`Error syncing expense ${expense.id}:`, error);
        continue;
      }

      // Mark as synced
      expense.pendingSync = false;
      syncedCount++;
    }

    // Save back to localStorage with updated sync status
    const updatedExpenses = localExpenses.map(expense => {
      const matchingPendingExpense = pendingExpenses.find(pe => pe.id === expense.id);
      return matchingPendingExpense || expense;
    });
    
    saveToLocalStorage(EXPENSES_STORAGE_KEY, updatedExpenses);

    console.log(`Successfully synced ${syncedCount} out of ${pendingExpenses.length} expenses`);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing expenses:', error);
    return 0;
  }
};

/**
 * Alias for syncExpenses for backward compatibility
 */
export const syncExpensesData = syncExpenses;
