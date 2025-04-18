
import { supabase } from '@/integrations/supabase/client';
import { generateUUID } from '@/lib/utils/uuidUtils';
import { Expense } from '@/lib/types/expense.types';
import { getFromLocalStorage, saveToLocalStorage } from './coreUtils';
import { EXPENSES_STORAGE_KEY } from '@/lib/constants/storageKeys';
import { SyncableExpense } from './sync/expensesSync';

// Get stored expenses
export const getStoredExpenses = (): SyncableExpense[] => {
  const expenses = getFromLocalStorage<SyncableExpense[]>(EXPENSES_STORAGE_KEY) || [];
  return expenses;
};

// Save a new expense
export const storeExpense = (expenseData: Omit<Expense, 'id'>): SyncableExpense => {
  try {
    const expenses = getStoredExpenses();
    
    // Create a new expense object with an ID
    const newExpense: SyncableExpense = {
      id: generateUUID(),
      ...expenseData,
      pendingSync: true,
      synced: false
    };
    
    // Add to stored expenses
    expenses.push(newExpense);
    
    // Sort by date (newest first)
    expenses.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    
    // Save to localStorage
    saveToLocalStorage(EXPENSES_STORAGE_KEY, expenses);
    
    // Try to save to Supabase
    saveExpenseToSupabase(newExpense).catch(error => {
      console.error('Error saving expense to Supabase:', error);
    });
    
    return newExpense;
  } catch (error) {
    console.error('Error storing expense:', error);
    throw error;
  }
};

// Save expense to Supabase
const saveExpenseToSupabase = async (expense: SyncableExpense): Promise<void> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .insert({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category
      });
    
    if (error) throw error;
    
    // Update local expense to mark as synced
    const expenses = getStoredExpenses();
    const index = expenses.findIndex(e => e.id === expense.id);
    
    if (index !== -1) {
      expenses[index].pendingSync = false;
      expenses[index].synced = true;
      saveToLocalStorage(EXPENSES_STORAGE_KEY, expenses);
    }
  } catch (error) {
    console.error('Error saving expense to Supabase:', error);
    throw error;
  }
};

// Get all expenses from Supabase
export const fetchAllExpensesFromSupabase = async (): Promise<SyncableExpense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Convert to SyncableExpense format
    const expenses: SyncableExpense[] = data.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category || '',
      synced: true,
      pendingSync: false
    }));
    
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses from Supabase:', error);
    return [];
  }
};

// Sync local expenses with Supabase
export const syncExpenses = async (): Promise<void> => {
  try {
    // Get local expenses
    const localExpenses = getStoredExpenses();
    
    // Get remote expenses
    const remoteExpenses = await fetchAllExpensesFromSupabase();
    
    // Find expenses that are in both local and remote
    const localIds = new Set(localExpenses.map(e => e.id));
    const remoteIds = new Set(remoteExpenses.map(e => e.id));
    
    // Find expenses in remote but not in local
    const expensesToAdd = remoteExpenses.filter(e => !localIds.has(e.id));
    
    // Add new remote expenses to local
    if (expensesToAdd.length > 0) {
      const updatedExpenses = [...localExpenses, ...expensesToAdd];
      
      // Sort by date (newest first)
      updatedExpenses.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
      
      saveToLocalStorage(EXPENSES_STORAGE_KEY, updatedExpenses);
    }
    
    // Update sync status of local expenses that are also in remote
    const updatedLocalExpenses = localExpenses.map(expense => {
      if (remoteIds.has(expense.id)) {
        return { ...expense, synced: true, pendingSync: false };
      }
      return expense;
    });
    
    saveToLocalStorage(EXPENSES_STORAGE_KEY, updatedLocalExpenses);
  } catch (error) {
    console.error('Error syncing expenses:', error);
  }
};

// Delete an expense
export const deleteExpense = async (expenseId: string): Promise<boolean> => {
  try {
    // Delete from Supabase first
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);
    
    if (error) throw error;
    
    // Delete from local storage
    const expenses = getStoredExpenses();
    const updatedExpenses = expenses.filter(e => e.id !== expenseId);
    saveToLocalStorage(EXPENSES_STORAGE_KEY, updatedExpenses);
    
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    
    // Even if Supabase fails, still remove from local storage
    try {
      const expenses = getStoredExpenses();
      const updatedExpenses = expenses.filter(e => e.id !== expenseId);
      saveToLocalStorage(EXPENSES_STORAGE_KEY, updatedExpenses);
    } catch (localError) {
      console.error('Error removing expense from local storage:', localError);
    }
    
    return false;
  }
};
