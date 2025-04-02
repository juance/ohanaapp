
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types';
import { 
  getFromLocalStorage,
  EXPENSES_STORAGE_KEY 
} from '../coreUtils';

/**
 * Get all expenses with optional date filtering
 */
export const getExpenses = async (startDate?: Date, endDate?: Date): Promise<Expense[]> => {
  try {
    let query = supabase
      .from('expenses')
      .select('*');
    
    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    
    // Map Supabase data to match our Expense type
    return data.map((item: any) => ({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error retrieving expenses from Supabase:', error);
    
    // Fallback to localStorage
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    
    // Filter by date if provided
    if (startDate || endDate) {
      return localExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        
        if (startDate && expenseDate < startDate) return false;
        if (endDate && expenseDate > endDate) return false;
        
        return true;
      });
    }
    
    return localExpenses;
  }
};

// Alias for getExpenses to maintain compatibility
export const getStoredExpenses = async (): Promise<Expense[]> => {
  return getExpenses();
};
