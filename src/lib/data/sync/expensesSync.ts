
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, EXPENSES_STORAGE_KEY } from '../coreUtils';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from '@/lib/types';

/**
 * Synchronize locally stored expenses with Supabase
 * @returns Number of successfully synced expenses
 */
export const syncExpenses = async (): Promise<number> => {
  try {
    // Get locally stored expenses
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    
    // Check if there are expenses to sync
    const expensesToSync = localExpenses.filter(expense => expense.pendingSync);
    
    if (expensesToSync.length === 0) {
      console.log('No expenses to sync');
      return 0;
    }
    
    console.log(`Found ${expensesToSync.length} expenses to sync`);
    
    // Track successfully synced expenses
    let syncedCount = 0;
    
    // Process each expense
    for (const expense of expensesToSync) {
      try {
        // Create expense in Supabase
        const { data: createdExpense, error: expenseError } = await supabase
          .from('expenses')
          .insert({
            id: uuidv4(),
            description: expense.description,
            amount: expense.amount,
            date: expense.date || new Date().toISOString(),
            category: expense.category
          })
          .select('id')
          .single();
        
        if (expenseError) throw expenseError;
        
        // Mark as synced in local storage
        expense.pendingSync = false;
        expense.synced = true;
        syncedCount++;
      } catch (expenseSyncError) {
        console.error(`Error syncing expense ${expense.id}:`, expenseSyncError);
      }
    }
    
    // Update local storage with synced status
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(localExpenses));
    
    console.log(`Successfully synced ${syncedCount} out of ${expensesToSync.length} expenses`);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing expenses:', error);
    return 0;
  }
};
