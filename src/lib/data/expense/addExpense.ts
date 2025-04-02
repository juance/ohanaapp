
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types';
import { 
  saveToLocalStorage, 
  getFromLocalStorage,
  EXPENSES_STORAGE_KEY 
} from '../coreUtils';

/**
 * Add a new expense
 */
export const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        description: expense.description,
        amount: expense.amount,
        date: expense.date
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding expense to Supabase:', error);
    
    // Fallback to localStorage
    try {
      const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
      
      const newExpense: Expense = {
        id: crypto.randomUUID(),
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        createdAt: new Date().toISOString()
      };
      
      // Add to expenses array - fixed: push to array instead of passing as parameter
      localExpenses.push(newExpense);
      saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
      return true;
    } catch (localError) {
      console.error('Error saving expense to localStorage:', localError);
      return false;
    }
  }
};
