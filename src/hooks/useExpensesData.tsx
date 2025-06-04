
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  created_at?: string;
}

export interface ExpenseFormData {
  description: string;
  amount: number;
  date: string;
}

export const useExpensesData = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        throw error;
      }

      const mappedExpenses: Expense[] = data.map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        created_at: expense.created_at
      }));

      setExpenses(mappedExpenses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar gastos';
      console.error('Error in fetchExpenses:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: ExpenseFormData): Promise<void> => {
    try {
      setError(null);
      console.log('Adding expense:', expenseData);

      // Validate required fields
      if (!expenseData.description || !expenseData.description.trim()) {
        throw new Error('La descripción es requerida');
      }

      if (!expenseData.amount || expenseData.amount <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      if (!expenseData.date) {
        throw new Error('La fecha es requerida');
      }

      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          description: expenseData.description.trim(),
          amount: expenseData.amount,
          date: new Date(expenseData.date).toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating expense:', error);
        throw new Error(`Error al guardar el gasto: ${error.message}`);
      }

      console.log('Successfully created expense:', data);

      const newExpense: Expense = {
        id: data.id,
        description: data.description,
        amount: data.amount,
        date: data.date,
        created_at: data.created_at
      };

      setExpenses(prev => [newExpense, ...prev]);
      console.log('Gasto agregado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al guardar el gasto';
      console.error('Error in addExpense:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteExpense = async (id: string): Promise<void> => {
    try {
      setError(null);
      console.log('Deleting expense:', id);

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting expense:', error);
        throw new Error(`Error al eliminar el gasto: ${error.message}`);
      }

      setExpenses(prev => prev.filter(expense => expense.id !== id));
      console.log('Gasto eliminado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el gasto';
      console.error('Error in deleteExpense:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    deleteExpense
  };
};
