import { supabase } from '@/integrations/supabase/client';
import { SyncableExpense } from '@/lib/types/sync.types';
import { Expense } from '@/lib/types/expense.types';

const STORAGE_KEY = 'expenses';

// Get all stored expenses
export const getStoredExpenses = (): SyncableExpense[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return [];

    const expenses = JSON.parse(storedData);
    return Array.isArray(expenses) ? expenses : [];
  } catch (error) {
    console.error('Error getting stored expenses:', error);
    return [];
  }
};

// Store a new expense
export const storeExpense = async (expense: Omit<SyncableExpense, 'id'>): Promise<SyncableExpense | null> => {
  try {
    const newExpense: SyncableExpense = {
      id: crypto.randomUUID(),
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      pendingSync: true
    };

    // Get current expenses
    const expenses = getStoredExpenses();

    // Add new expense
    expenses.push(newExpense);

    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

    // Try to sync immediately if online
    try {
      // Asegurarse de que la fecha sea un string ISO válido
      let dateToUse = newExpense.date;

      // Si la fecha no es un string ISO válido, convertirla
      if (dateToUse && typeof dateToUse === 'string') {
        try {
          // Intentar crear un objeto Date a partir del string
          const dateObj = new Date(dateToUse);
          // Verificar si es una fecha válida
          if (!isNaN(dateObj.getTime())) {
            // Convertir a formato ISO
            dateToUse = dateObj.toISOString();
          } else {
            // Si no es válida, usar la fecha actual
            dateToUse = new Date().toISOString();
          }
        } catch (dateError) {
          console.error('Error al procesar la fecha:', dateError);
          dateToUse = new Date().toISOString();
        }
      } else {
        // Si no hay fecha, usar la fecha actual
        dateToUse = new Date().toISOString();
      }

      const { error } = await supabase
        .from('expenses')
        .insert([
          {
            id: newExpense.id,
            description: newExpense.description,
            amount: newExpense.amount,
            date: dateToUse
          }
        ]);

      if (!error) {
        // Mark as synced in local storage
        const updatedExpenses = expenses.map(e =>
          e.id === newExpense.id ? { ...e, pendingSync: false, synced: true } : e
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));

        newExpense.pendingSync = false;
        newExpense.synced = true;
      } else {
        console.error('Error al insertar gasto en Supabase:', error);
      }
    } catch (syncError) {
      console.error('Error syncing expense:', syncError);
      // Will be synced later, keep pendingSync as true
    }

    return newExpense;
  } catch (error) {
    console.error('Error storing expense:', error);
    return null;
  }
};

// Get expenses from Supabase
export const getExpensesFromDb = async (): Promise<SyncableExpense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return data.map(dbExpense => ({
      id: dbExpense.id,
      description: dbExpense.description,
      amount: dbExpense.amount,
      date: dbExpense.date,
      pendingSync: false,
      synced: true
    }));
  } catch (error) {
    console.error('Error getting expenses from DB:', error);
    return [];
  }
};
