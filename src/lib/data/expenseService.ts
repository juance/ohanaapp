
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { SyncableExpense } from '@/lib/types/sync.types';

// Get expenses from localStorage
export const getExpenses = (): SyncableExpense[] => {
  try {
    const expenses = localStorage.getItem('expenses');
    if (expenses) {
      return JSON.parse(expenses);
    }
    return [];
  } catch (e) {
    console.error('Error getting expenses from localStorage', e);
    return [];
  }
};

// For compatibility with the Expenses component
export const getStoredExpenses = getExpenses;

// Add a new expense
export const addExpense = (description: string, amount: number, date: string, category: string): SyncableExpense => {
  try {
    const expenses = getExpenses();
    
    const newExpense: SyncableExpense = {
      id: uuidv4(),
      description,
      amount,
      date,
      category,
      pendingSync: true
    };
    
    const updatedExpenses = [...expenses, newExpense];
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    
    return newExpense;
  } catch (e) {
    console.error('Error adding expense', e);
    throw new Error('Failed to add expense');
  }
};

// For compatibility with the Expenses component
export const storeExpense = (expenseData: { description: string; amount: number; date: string; category: string }): Promise<boolean> => {
  try {
    addExpense(expenseData.description, expenseData.amount, expenseData.date, expenseData.category);
    return Promise.resolve(true);
  } catch (e) {
    console.error('Error storing expense', e);
    return Promise.resolve(false);
  }
};

// Delete an expense
export const deleteExpense = (id: string): boolean => {
  try {
    const expenses = getExpenses();
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    return true;
  } catch (e) {
    console.error('Error deleting expense', e);
    return false;
  }
};

// Get expenses from Supabase
export const fetchServerExpenses = async (): Promise<SyncableExpense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date,
      category: 'other', // Provide default category since it's missing in the DB
      pendingSync: false, // Already synced since coming from server
      synced: true
    }));
  } catch (e) {
    console.error('Error fetching server expenses', e);
    return [];
  }
};

// Sync expenses with server
export const syncExpenses = async (): Promise<number> => {
  try {
    const expenses = getExpenses().filter(e => e.pendingSync);
    if (expenses.length === 0) return 0;
    
    let syncedCount = 0;
    for (const expense of expenses) {
      try {
        const { error } = await supabase
          .from('expenses')
          .insert({
            id: expense.id,
            description: expense.description,
            amount: expense.amount,
            date: expense.date
            // Note: category is not in the database schema
          });
        
        if (error) throw error;
        
        // Mark as synced
        expense.pendingSync = false;
        expense.synced = true;
        syncedCount++;
      } catch (e) {
        console.error(`Error syncing expense ${expense.id}`, e);
      }
    }
    
    // Update localStorage with synced status
    const allExpenses = getExpenses();
    const updatedExpenses = allExpenses.map(e => {
      const synced = expenses.find(se => se.id === e.id && !se.pendingSync);
      if (synced) {
        return { ...e, pendingSync: false, synced: true };
      }
      return e;
    });
    
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    
    return syncedCount;
  } catch (e) {
    console.error('Error syncing expenses', e);
    return 0;
  }
};
