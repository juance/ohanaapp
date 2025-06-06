
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types/expense.types';

export const getStoredExpenses = async (): Promise<Expense[]> => {
  try {
    console.log('Fetching expenses from database...');
    
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase error fetching expenses:', error);
      throw error;
    }

    console.log('Expenses fetched successfully:', data);

    return (data || []).map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: 'other', // Default category
      createdAt: expense.created_at
    }));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
};

export const storeExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    console.log('Storing expense:', expense);

    // Ensure date is a valid ISO string
    let dateToStore = expense.date;
    try {
      const dateObj = new Date(dateToStore);
      if (!isNaN(dateObj.getTime())) {
        dateToStore = dateObj.toISOString();
      } else {
        dateToStore = new Date().toISOString();
      }
    } catch (dateError) {
      console.error('Error parsing date:', dateError);
      dateToStore = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        description: expense.description,
        amount: expense.amount,
        date: dateToStore
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error storing expense:', error);
      throw error;
    }

    console.log('Expense stored successfully:', data);
    return true;
  } catch (error) {
    console.error('Error storing expense:', error);
    return false;
  }
};

export const deleteExpense = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting expense:', id);

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting expense:', error);
      throw error;
    }

    console.log('Expense deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
};
