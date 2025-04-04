
import { supabase } from '@/integrations/supabase/client';
import { Expense } from './types';
import { getFromLocalStorage, saveToLocalStorage } from './dataService';

const EXPENSES_STORAGE_KEY = 'laundry_expenses';

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
      const localExpenses = getFromLocalStorage<Expense>(EXPENSES_STORAGE_KEY);
      
      const newExpense: Expense = {
        id: crypto.randomUUID(),
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        createdAt: new Date().toISOString()
      };
      
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
    const localExpenses = getFromLocalStorage<Expense>(EXPENSES_STORAGE_KEY);
    
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
