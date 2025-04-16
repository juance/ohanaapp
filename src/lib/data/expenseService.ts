
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types/expense.types';

export const storeExpense = async (expense: Omit<Expense, 'id'>) => {
  try {
    // Validate expense data
    if (!expense.description || !expense.amount || !expense.date) {
      console.error('Invalid expense data:', expense);
      return null;
    }

    // Format the expense data
    const formattedExpense = {
      description: expense.description.trim(),
      amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
      date: expense.date,
      category: expense.category || 'operations'
    };

    // Insert the expense into the database
    const { data, error } = await supabase
      .from('expenses')
      .insert(formattedExpense)
      .select()
      .single();

    if (error) {
      console.error('Supabase error storing expense:', error);
      throw error;
    }

    console.log('Expense stored successfully:', data);
    return data;
  } catch (error) {
    console.error('Error storing expense:', error);
    return null;
  }
};

export const getStoredExpenses = async (): Promise<Expense[]> => {
  try {
    console.log('Fetching expenses from Supabase...');
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase error getting expenses:', error);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} expenses`);
    return data || [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

// Alias functions for backward compatibility
export const addExpense = storeExpense;
export const getExpenses = getStoredExpenses;
