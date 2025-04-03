
import { toast } from '@/hooks/use-toast';
import { Expense } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Adds a new expense to the database
 * 
 * @param expense The expense object to add
 * @returns The newly created expense if successful, null otherwise
 */
export const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense | null> => {
  try {
    // Format the date to ISO string for storage
    const formattedExpense = {
      ...expense,
      date: new Date(expense.date).toISOString(),
    };
    
    // Add to Supabase
    const { data, error } = await supabase
      .from('expenses')
      .insert(formattedExpense)
      .select()
      .single();
      
    if (error) throw error;
    
    const newExpense: Expense = {
      ...data,
      date: data.date, // Keep as string
      createdAt: data.created_at // Map to createdAt
    };
    
    // Cache locally if needed
    const existingExpenses = getLocalExpenses();
    saveLocalExpenses([...existingExpenses, newExpense]);
    
    return newExpense;
    
  } catch (error) {
    console.error("Failed to add expense:", error);
    toast.error("Error al agregar gasto");
    return null;
  }
};

// Helper functions for local storage
const LOCAL_STORAGE_KEY = 'expenses';

export const getLocalExpenses = (): Expense[] => {
  try {
    const storedExpenses = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedExpenses) return [];
    
    const parsedExpenses = JSON.parse(storedExpenses);
    return Array.isArray(parsedExpenses) ? parsedExpenses : [];
  } catch (error) {
    console.error("Failed to get local expenses:", error);
    return [];
  }
};

export const saveLocalExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Failed to save local expenses:", error);
  }
};
