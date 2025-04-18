
import { supabase } from '@/integrations/supabase/client';
<<<<<<< HEAD
import { Expense } from '@/lib/types/expense.types';
import { SyncableExpense } from '@/lib/data/sync/expensesSync';
=======
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/lib/toast';
import { getFromLocalStorage, saveToLocalStorage } from './coreUtils';
import { EXPENSES_STORAGE_KEY } from '@/lib/constants/storageKeys';
>>>>>>> 9e487415867c0af8c7ebd3d45989bab053aea456

// Define SyncableExpense type
export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: Date | string;
  createdAt?: string;
  pendingSync?: boolean;
  synced?: boolean;
  category?: string;
}

export const storeExpense = async (
  expenseData: Omit<SyncableExpense, 'id' | 'pendingSync' | 'synced'>
): Promise<boolean> => {
  try {
    // Try to store in Supabase first
    const { error } = await supabase
      .from('expenses')
      .insert({
        description: expenseData.description,
        amount: expenseData.amount,
        date: typeof expenseData.date === 'string' ? expenseData.date : expenseData.date.toISOString()
      });

    if (error) {
      console.error('Error storing expense in Supabase:', error);
      
      // Fallback to local storage
      const expense: SyncableExpense = {
        id: uuidv4(),
        description: expenseData.description,
        amount: expenseData.amount,
        date: typeof expenseData.date === 'string' ? expenseData.date : expenseData.date.toISOString(),
        createdAt: new Date().toISOString(),
        pendingSync: true,
        synced: false
      };
      
      // Get existing expenses
      const existingExpenses = getFromLocalStorage<SyncableExpense[]>(EXPENSES_STORAGE_KEY) || [];
      
      // Add new expense
      existingExpenses.push(expense);
      
      // Save back to local storage
      saveToLocalStorage(EXPENSES_STORAGE_KEY, existingExpenses);
      
      toast({
        title: "Gasto guardado localmente",
        description: "Se sincronizará cuando haya conexión"
      });
      
      return true;
    }
    
    toast({
      title: "Gasto registrado",
      description: `${expenseData.description}: $${expenseData.amount}`
    });
    
    return true;
  } catch (error) {
    console.error('Error storing expense:', error);
    
    return false;
  }
};

export const getStoredExpenses = async (startDate?: Date, endDate?: Date): Promise<SyncableExpense[]> => {
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
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Map to our expected format
    const expenses: SyncableExpense[] = data.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      createdAt: expense.created_at
    }));
    
    // Filter by date if necessary
    let filteredExpenses = expenses;
    
    if (startDate || endDate) {
      filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        
        if (startDate && expenseDate < startDate) return false;
        if (endDate && expenseDate > endDate) return false;
        
        return true;
      });
    }
    
    return filteredExpenses;
  } catch (error) {
    console.error('Error retrieving expenses from Supabase:', error);
    
    // Fallback to localStorage
    const localExpenses = getFromLocalStorage<SyncableExpense[]>(EXPENSES_STORAGE_KEY) || [];
    
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
