
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
      const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
      
      const newExpense: Expense = {
        id: crypto.randomUUID(),
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        createdAt: new Date().toISOString()
      };
      
      // Add to expenses array
      localExpenses.push(newExpense);
      saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
      return true;
    } catch (localError) {
      console.error('Error saving expense to localStorage:', localError);
      return false;
    }
  }
};

// Alias for addExpense to maintain compatibility with existing code
export const storeExpense = addExpense;

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
    
    // Map Supabase data to match our Expense type
    return data.map(item => ({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error retrieving expenses from Supabase:', error);
    
    // Fallback to localStorage
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    
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

// Alias for getExpenses to maintain compatibility
export const getStoredExpenses = async (): Promise<Expense[]> => {
  return getExpenses();
}

// Get expenses for the current day
export const getDailyExpenses = async (): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expenses = await getExpenses(today);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Get expenses for the current week
export const getWeeklyExpenses = async (): Promise<number> => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0);
  
  const expenses = await getExpenses(startOfWeek);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Get expenses for the current month
export const getMonthlyExpenses = async (): Promise<number> => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const expenses = await getExpenses(startOfMonth);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};
