
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types';
import { 
  saveToLocalStorage, 
  getFromLocalStorage,
  EXPENSES_STORAGE_KEY 
} from './coreUtils';

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
      const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY);
      
      const newExpense: Expense = {
        id: crypto.randomUUID(),
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        createdAt: new Date().toISOString()
      };
      
      // Add to beginning of array
      localExpenses.push(newExpense);
      saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
      return true;
    } catch (localError) {
      console.error('Error saving expense to localStorage:', localError);
      return false;
    }
  }
};

/**
 * Get all expenses with optional date filtering
 */
export const getExpenses = async (startDate?: Date, endDate?: Date): Promise<Expense[]> => {
  try {
    let query = supabase
      .from('expenses')
      .select('*');
    
    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    
    return data as Expense[];
  } catch (error) {
    console.error('Error retrieving expenses from Supabase:', error);
    
    // Fallback to localStorage
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY);
    
    // Filter by date if provided
    if (startDate || endDate) {
      return localExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        
        if (startDate && expenseDate < startDate) return false;
        if (endDate && expenseDate > endDate) return false;
        
        return true;
      });
    }
    
    return localExpenses;
  }
};
