
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types/expense.types';
import { SyncableExpense } from '@/lib/data/sync/expensesSync';

export const storeExpense = async (expense: Omit<Expense, 'id'>) => {
  try {
    // Validar datos del gasto
    if (!expense.description || !expense.amount || !expense.date) {
      console.error('Datos de gasto inválidos:', expense);
      return null;
    }

    // Formatear los datos del gasto
    const formattedExpense = {
      description: expense.description.trim(),
      amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
      date: expense.date
      // Removed category field as it doesn't exist in the database
    };

    // Insertar el gasto en la base de datos
    const { data, error } = await supabase
      .from('expenses')
      .insert(formattedExpense)
      .select()
      .single();

    if (error) {
      console.error('Error al guardar gasto en Supabase:', error);
      throw error;
    }

    console.log('Gasto guardado correctamente:', data);
    return data;
  } catch (error) {
    console.error('Error al guardar gasto:', error);
    return null;
  }
};

export const getStoredExpenses = async (): Promise<Expense[]> => {
  try {
    console.log('Obteniendo gastos desde Supabase...');
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error al obtener gastos desde Supabase:', error);
      throw error;
    }

    console.log(`Se obtuvieron ${data?.length || 0} gastos correctamente`);
    return data || [];
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return [];
  }
};

// Alias functions for backward compatibility
export const addExpense = storeExpense;
export const getExpenses = getStoredExpenses;
