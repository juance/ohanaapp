
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseCategory } from '../types';

export const storeExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense | null> => {
  try {
    const newExpense: Expense = {
      id: uuidv4(),
      ...expenseData,
      createdAt: new Date().toISOString()
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
    
    // If successful, use the Supabase ID
    newExpense.id = data.id;
    
    // Save to local storage as well
    const localExpenses = getFromLocalStorage<Expense[]>('expenses') || [];
    localExpenses.push(newExpense);
    saveToLocalStorage('expenses', localExpenses);
    
    return newExpense;
  } catch (error) {
    console.error('Error storing expense:', error);
    
    // If Supabase fails, save locally for later sync
    try {
      const newExpense: Expense = {
        id: uuidv4(),
        ...expenseData,
        createdAt: new Date().toISOString(),
        pendingSync: true
      };
      
      const localExpenses = getFromLocalStorage<Expense[]>('expenses') || [];
      localExpenses.push(newExpense);
      saveToLocalStorage('expenses', localExpenses);
      
      return newExpense;
    } catch (localError) {
      console.error('Error saving expense locally:', localError);
      return null;
    }
  }
};

export const getStoredExpenses = async (): Promise<Expense[]> => {
  try {
    // First try to get from Supabase
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform to our internal format
    const expenses: Expense[] = data.map(item => ({
      id: item.id,
      description: item.description,
      amount: item.amount,
      category: item.category as ExpenseCategory || 'other',
      date: item.date,
      createdAt: item.created_at
    }));
    
    // Merge with local expenses that are pending sync
    const localExpenses = getFromLocalStorage<Expense[]>('expenses') || [];
    const pendingExpenses = localExpenses.filter(exp => exp.pendingSync);
    
    return [...expenses, ...pendingExpenses];
  } catch (error) {
    console.error('Error getting expenses from Supabase:', error);
    
    // Fallback to local storage
    return getFromLocalStorage<Expense[]>('expenses') || [];
  }
};

// Helper functions for localStorage
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
