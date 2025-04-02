
import { useState, useEffect } from 'react';
import { getStoredExpenses, storeExpense } from '@/lib/dataService';
import { Expense } from '@/lib/types';

interface UseExpensesDataReturn {
  loading: boolean;
  error: Error | null;
  expenses: Expense[];
  totalExpenses: number;
  refreshData: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
}

export const useExpensesData = (): UseExpensesDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  
  const fetchExpenses = async () => {
    try {
      // Get all expenses
      const allExpenses = await getStoredExpenses();
      
      setExpenses(allExpenses);
      
      // Calculate total
      const total = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalExpenses(total);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching expenses'));
    } finally {
      setLoading(false);
    }
  };
  
  const refreshData = async () => {
    setLoading(true);
    await fetchExpenses();
  };
  
  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      await storeExpense(expense);
      await fetchExpenses(); // Refresh the data after adding a new expense
    } catch (err) {
      console.error("Error adding expense:", err);
      throw err;
    }
  };
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  return {
    loading,
    error,
    expenses,
    totalExpenses,
    refreshData,
    addExpense
  };
};
