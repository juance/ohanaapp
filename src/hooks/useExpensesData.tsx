
import { useState, useEffect } from 'react';
import { Expense } from '@/lib/types/expense.types';
import { getStoredExpenses, storeExpense, deleteExpense } from '@/lib/data/expenseService';
import { useToast } from '@/hooks/use-toast';

export const useExpensesData = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const storedExpenses = await getStoredExpenses();
      setExpenses(storedExpenses);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Error al cargar los gastos');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los gastos"
      });
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const success = await storeExpense({
        ...expenseData,
        date: expenseData.date || new Date().toISOString()
      });

      if (success) {
        toast({
          title: "Éxito",
          description: "Gasto agregado correctamente"
        });
        await loadExpenses(); // Recargar la lista
        return true;
      } else {
        throw new Error('Error al guardar el gasto');
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al agregar el gasto: ${errorMessage}`
      });
      return false;
    }
  };

  const removeExpense = async (id: string) => {
    try {
      const success = await deleteExpense(id);
      
      if (success) {
        toast({
          title: "Éxito",
          description: "Gasto eliminado correctamente"
        });
        await loadExpenses(); // Recargar la lista
        return true;
      } else {
        throw new Error('Error al eliminar el gasto');
      }
    } catch (err) {
      console.error('Error removing expense:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar el gasto"
      });
      return false;
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    addExpense,
    removeExpense,
    refreshExpenses: loadExpenses
  };
};
