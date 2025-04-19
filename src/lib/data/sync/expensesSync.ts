
import { supabase } from '@/integrations/supabase/client';
import { SyncableExpense } from '@/lib/types/sync.types';

// Function to sync expenses with the server
export const syncExpenses = async (expenses: SyncableExpense[]): Promise<number> => {
  try {
    let syncedCount = 0;
    
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return 0;
    }
    
    // Filter expenses that need to be synced
    const expensesToSync = expenses.filter(expense => expense.pendingSync && !expense.synced);
    
    if (expensesToSync.length === 0) {
      return 0;
    }
    
    // Process each expense for syncing
    for (const expense of expensesToSync) {
      // Create expense in Supabase
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          // Note: category field is not present in the database schema
        })
        .select();
      
      if (error) {
        console.error('Error syncing expense:', error);
        continue;
      }
      
      // Mark as synced
      expense.pendingSync = false;
      expense.synced = true;
      
      syncedCount++;
    }
    
    return syncedCount;
  } catch (error) {
    console.error('Error in syncExpenses:', error);
    return 0;
  }
};
