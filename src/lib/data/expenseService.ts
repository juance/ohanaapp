
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from '@/lib/types/expense.types';
import { SyncableExpense } from '@/lib/types';

// Get stored expenses
export const getStoredExpenses = async (): Promise<Expense[]> => {
  try {
    // Check if connected to Supabase
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

// Store a new expense
export const storeExpense = async (expenseData: Omit<Expense, 'id'>): Promise<boolean> => {
  try {
    const newExpense: SyncableExpense = {
      id: uuidv4(),
      description: expenseData.description,
      amount: expenseData.amount,
      date: expenseData.date || new Date().toISOString(),
      pendingSync: true,
      synced: false
    };
    
    // Store directly in Supabase
    const { error } = await supabase
      .from('expenses')
      .insert({
        id: newExpense.id,
        description: newExpense.description,
        amount: newExpense.amount,
        date: newExpense.date
      });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error storing expense:', error);
    return false;
  }
};

// Delete an expense
export const deleteExpense = async (expenseId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
};

// Update an expense
export const updateExpense = async (expenseId: string, expenseData: Partial<Expense>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .update({
        description: expenseData.description,
        amount: expenseData.amount,
        date: expenseData.date
      })
      .eq('id', expenseId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating expense:', error);
    return false;
  }
};
