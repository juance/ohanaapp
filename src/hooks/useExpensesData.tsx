
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { SyncableExpense } from '@/lib/types/sync.types';

export const useExpensesData = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  // Load expenses data
  const loadExpensesData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setExpenses(data || []);
    } catch (error) {
      console.error('Error loading expenses data:', error);
      toast.error('Error al cargar datos de gastos');
      
      // Try to get expenses from local storage as fallback
      const localExpenses = localStorage.getItem('expenses');
      if (localExpenses) {
        setExpenses(JSON.parse(localExpenses));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadExpensesData();
  }, []);

  // Handle adding a new expense
  const handleAddExpense = async () => {
    if (newExpense.amount <= 0) {
      toast.error('El monto debe ser mayor que cero');
      return;
    }

    if (!newExpense.description.trim()) {
      toast.error('La descripción es requerida');
      return;
    }

    setIsAddingExpense(true);
    
    try {
      // Prepare the data ensuring it has all required properties
      const expenseData: Partial<SyncableExpense> = {
        amount: newExpense.amount,
        description: newExpense.description,
        date: newExpense.date,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select();

      if (error) throw error;
      
      toast.success('Gasto agregado correctamente');
      // Reset form
      setNewExpense({
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      // Refresh data
      loadExpensesData();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Error al agregar el gasto');
      
      // Store in local storage for later sync
      const localExpenses = localStorage.getItem('expenses');
      const expenses = localExpenses ? JSON.parse(localExpenses) : [];
      const newLocalExpense = {
        ...newExpense,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        synced: false
      };
      expenses.push(newLocalExpense);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      
      toast.info('Gasto guardado localmente para sincronización posterior');
    } finally {
      setIsAddingExpense(false);
    }
  };

  return {
    expenses,
    isLoading,
    newExpense,
    setNewExpense,
    isAddingExpense,
    handleAddExpense,
    refreshExpenses: loadExpensesData
  };
};
