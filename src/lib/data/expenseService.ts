import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage } from './coreUtils';

// Helper functions for localStorage interaction
const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`Error getting ${key} from localStorage:`, e);
    return null;
  }
};

const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

export const storeExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense | null> => {
  try {
    const newExpense: Expense = {
      id: uuidv4(),
      ...expenseData,
      createdAt: new Date().toISOString(),
      pendingSync: false
    };
    
    // Try to add to Supabase
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        description: newExpense.description,
        amount: newExpense.amount,
        category: newExpense.category,
        date: newExpense.date
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return newExpense;
  } catch (error) {
    console.error('Error storing expense:', error);
    return null;
  }
};

export const getStoredExpenses = async (): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      description: item.description || '',
      amount: item.amount,
      category: item.category,
      date: item.date,
      createdAt: item.created_at,
      pendingSync: false
    }));
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};
