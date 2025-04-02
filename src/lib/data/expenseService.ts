
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '../types';
import { getFromLocalStorage, saveToLocalStorage, EXPENSES_STORAGE_KEY } from './coreUtils';

export const storeExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .insert([{
        description: expense.description,
        amount: expense.amount,
        date: expense.date
      }]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error storing expense in Supabase:', error);
    
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
      
      // Add the new expense to the array and save it
      localExpenses.push(newExpense);
      saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
      return true;
    } catch (localError) {
      console.error('Error saving expense to localStorage:', localError);
      return false;
    }
  }
};

export const getStoredExpenses = async (startDate?: Date, endDate?: Date): Promise<Expense[]> => {
  try {
    let query = supabase.from('expenses').select('*');
    
    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map((expense: any) => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      createdAt: expense.created_at
    }));
  } catch (error) {
    console.error('Error retrieving expenses from Supabase:', error);
    
    // Fallback to localStorage
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    
    // Filter by date if provided
    if (startDate || endDate) {
      return localExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        
        if (startDate && expenseDate < startDate) return false;
        if (endDate && expenseDate > endDate) return false;
        
        return true;
      });
    }
    
    return localExpenses;
  }
};

// Utility functions to get expenses by time period
export const getDailyExpenses = async (): Promise<number> => {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  const expenses = await getStoredExpenses(startOfDay, endOfDay);
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

export const getWeeklyExpenses = async (): Promise<number> => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
  endOfWeek.setHours(23, 59, 59, 999);
  
  const expenses = await getStoredExpenses(startOfWeek, endOfWeek);
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

export const getMonthlyExpenses = async (): Promise<number> => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  
  const expenses = await getStoredExpenses(startOfMonth, endOfMonth);
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};
