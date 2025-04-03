
import { toast } from '@/hooks/use-toast';
import { Expense } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all expenses from the database
 * 
 * @returns Array of expenses
 */
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Convert to Expense type
    const expenses: Expense[] = data.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date, // Keep as string
      createdAt: expense.created_at // Map to createdAt
    }));
    
    // Cache locally
    saveLocalExpenses(expenses);
    
    return expenses;
    
  } catch (error) {
    console.error("Failed to fetch expenses from Supabase:", error);
    toast.error("Error al cargar gastos");
    
    // Fallback to local storage
    return getLocalExpenses();
  }
};

/**
 * Get expenses filtered by date range
 * 
 * @param startDate The start date for filtering
 * @param endDate The end date for filtering
 * @returns Array of filtered expenses
 */
export const getExpensesByDateRange = async (startDate: Date, endDate: Date): Promise<Expense[]> => {
  try {
    const expenses = await getExpenses();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
    
  } catch (error) {
    console.error("Failed to filter expenses by date:", error);
    toast.error("Error al filtrar gastos por fecha");
    return [];
  }
};

// Helper functions for local storage
const LOCAL_STORAGE_KEY = 'expenses';

export const getLocalExpenses = (): Expense[] => {
  try {
    const storedExpenses = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedExpenses) return [];
    
    const parsedExpenses = JSON.parse(storedExpenses);
    if (!Array.isArray(parsedExpenses)) return [];
    
    // Return as is since we're now using string dates consistently
    return parsedExpenses;
    
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

// Add missing export
export const getStoredExpenses = getLocalExpenses;
