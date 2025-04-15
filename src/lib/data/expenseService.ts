
import { supabase } from '@/integrations/supabase/client';
import { Expense, ExpenseCategory } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { getFromLocalStorage, saveToLocalStorage } from './coreUtils';
import { EXPENSES_STORAGE_KEY } from '@/lib/types/error.types';

/**
 * Obtener todos los gastos
 */
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    // Intentar obtener gastos de la API
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Si la API responde correctamente, formatear y devolver los datos
    return (data || []).map(item => ({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date,
      category: (item.category as ExpenseCategory) || 'other', // Valor por defecto si no existe
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error getting expenses from API, falling back to local storage:', error);
    
    // Si hay un error, obtener los datos del almacenamiento local
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    return localExpenses;
  }
};

/**
 * Agregar un nuevo gasto
 */
export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  try {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4(),
      pendingSync: true
    };
    
    // Intentar guardar en la API
    const { error } = await supabase
      .from('expenses')
      .insert({
        id: newExpense.id,
        description: newExpense.description,
        amount: newExpense.amount,
        date: newExpense.date,
        category: newExpense.category
      });
    
    if (error) throw error;
    
    // Si se guarda correctamente en la API, no es necesario marcarlo como pendiente
    newExpense.pendingSync = false;
    
    // Guardar en almacenamiento local (con o sin sincronización pendiente)
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    localExpenses.push(newExpense);
    saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
    
    return newExpense;
  } catch (error) {
    console.error('Error saving expense to API, stored locally:', error);
    
    // Si hay un error, guardar solo localmente con marca de sincronización pendiente
    const newExpense: Expense = {
      ...expense,
      id: uuidv4(),
      pendingSync: true
    };
    
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    localExpenses.push(newExpense);
    saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
    
    return newExpense;
  }
};

/**
 * Eliminar un gasto
 */
export const deleteExpense = async (id: string): Promise<boolean> => {
  try {
    // Intentar eliminar de la API
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Si se elimina correctamente de la API, eliminar del almacenamiento local
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    const updatedExpenses = localExpenses.filter(expense => expense.id !== id);
    saveToLocalStorage(EXPENSES_STORAGE_KEY, updatedExpenses);
    
    return true;
  } catch (error) {
    console.error('Error deleting expense from API:', error);
    
    // Si hay un error en la API, intentar eliminar solo localmente
    const localExpenses = getFromLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY) || [];
    const updatedExpenses = localExpenses.filter(expense => expense.id !== id);
    saveToLocalStorage(EXPENSES_STORAGE_KEY, updatedExpenses);
    
    return false;
  }
};
