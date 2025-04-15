
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage, EXPENSES_STORAGE_KEY } from '../coreUtils';

export const syncExpenses = async (): Promise<number> => {
  try {
    // Get locally stored expenses
    const localExpenses: Expense[] = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    
    // Check if there are expenses to sync
    const expensesToSync = localExpenses.filter(expense => expense.pendingSync);
    
    if (expensesToSync.length === 0) {
      console.log('No expenses to sync');
      return 0;
    }
    
    let syncedCount = 0;
    
    for (const expense of expensesToSync) {
      try {
        const { error } = await supabase
          .from('expenses')
          .insert({
            id: expense.id,
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            category: expense.category
          });
        
        if (error) throw error;
        
        // Actualizar el estado local
        const index = localExpenses.findIndex(e => e.id === expense.id);
        if (index !== -1) {
          localExpenses[index].pendingSync = false;
          localExpenses[index].synced = true;
        }
        syncedCount++;
      } catch (expenseSyncError) {
        console.error(`Error syncing expense ${expense.id}:`, expenseSyncError);
      }
    }
    
    saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing expenses:', error);
    return 0;
  }
};
