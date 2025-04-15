
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types/expense.types';

export const storeExpense = async (expense: Omit<Expense, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category
      })
      .select()
      .single();

    if (error) throw error;
    return data;
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
    return data || [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

// Alias functions for backward compatibility
export const addExpense = storeExpense;
export const getExpenses = getStoredExpenses;
