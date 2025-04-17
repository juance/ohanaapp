
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types';

// Add expense function
export const addExpense = async (
  description: string, 
  amount: number, 
  date?: Date
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .insert({
        description,
        amount,
        date: date ? date.toISOString() : new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding expense:', error);
    return false;
  }
};

// Get expenses function
export const getExpenses = async (): Promise<Expense[]> => {
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

// Update expense function
export const updateExpense = async (
  id: string,
  description: string,
  amount: number,
  date: string,
  pendingSync?: boolean,
  synced?: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .update({
        description,
        amount,
        date,
        pendingSync,
        synced
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating expense:', error);
    return false;
  }
};

// Delete expense function
export const deleteExpense = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
};
