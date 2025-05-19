
// Corregir el error en expenseService.ts relacionado con 'createdAt' vs 'created_at'
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { SyncableExpense } from '@/lib/types/sync.types';
import { Expense } from '@/lib/types/expense.types';

/**
 * Crear un nuevo gasto
 */
export const createExpense = async (expense: Expense): Promise<Expense | null> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          id: expense.id || uuidv4(),
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
          created_at: new Date().toISOString(),
          pendingSync: true,
          synced: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating expense:', error);
      return null;
    }

    return data as Expense;
  } catch (error) {
    console.error('Error creating expense:', error);
    return null;
  }
};

/**
 * Almacenar un gasto
 * (Alias para createExpense para mantener compatibilidad)
 */
export const storeExpense = async (expense: Partial<Expense>): Promise<Expense | null> => {
  const fullExpense: Expense = {
    id: expense.id || uuidv4(),
    description: expense.description || '',
    amount: expense.amount || 0,
    date: expense.date || new Date().toISOString(),
    category: expense.category || 'other',
    createdAt: expense.createdAt || new Date().toISOString(),
    pendingSync: true,
    synced: false
  };
  
  return createExpense(fullExpense);
};

/**
 * Obtener todos los gastos almacenados
 * (Alias para getAllExpenses para mantener compatibilidad)
 */
export const getStoredExpenses = async (): Promise<Expense[]> => {
  return getAllExpenses();
};

/**
 * Obtener todos los gastos
 */
export const getAllExpenses = async (): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }

    return data as Expense[];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
};

/**
 * Actualizar un gasto existente
 */
export const updateExpense = async (id: string, updates: Partial<Expense>): Promise<Expense | null> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating expense:', error);
      return null;
    }

    return data as Expense;
  } catch (error) {
    console.error('Error updating expense:', error);
    return null;
  }
};

/**
 * Eliminar un gasto
 */
export const deleteExpense = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
};

/**
 * Sincronizar gastos con el servidor
 */
export const syncExpenses = async (): Promise<{added: number, updated: number, failed: number}> => {
  let added = 0;
  let updated = 0;
  let failed = 0;

  try {
    // Obtener gastos locales pendientes de sincronización
    const { data: localExpenses, error: localError } = await supabase
      .from('expenses')
      .select('*')
      .eq('pendingSync', true);

    if (localError) {
      console.error('Error fetching local expenses:', localError);
      return { added, updated, failed };
    }

    // Sincronizar cada gasto pendiente
    for (const localExpense of localExpenses) {
      try {
        // Intentar insertar o actualizar el gasto en el servidor
        const { data: serverData, error: serverError } = await supabase
          .from('expenses')
          .upsert([localExpense], { onConflict: 'id' })
          .select()
          .single();

        if (serverError) {
          console.error('Error syncing expense to server:', serverError);
          failed++;
          continue;
        }

        // Marcar el gasto como sincronizado
        const { error: updateError } = await supabase
          .from('expenses')
          .update({ pendingSync: false, synced: true })
          .eq('id', localExpense.id);

        if (updateError) {
          console.error('Error updating expense status:', updateError);
          failed++;
          continue;
        }

        if (serverData) {
          if (localExpense.id === serverData.id) {
            updated++;
          } else {
            added++;
          }
        }
      } catch (syncError) {
        console.error('Error during sync:', syncError);
        failed++;
      }
    }
  } catch (error) {
    console.error('Error in syncExpenses:', error);
    failed++;
  }

  return {
    added,
    updated,
    failed
  };
};
