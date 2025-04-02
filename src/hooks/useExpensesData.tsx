import { useState, useEffect } from 'react';
import { 
  getExpenses, 
  addExpense, 
  getDailyExpenses, 
  getWeeklyExpenses, 
  getMonthlyExpenses 
} from '@/lib/data/expense';
import { Expense } from '@/lib/types';

interface UseExpensesDataReturn {
  loading: boolean;
  error: Error | null;
  expenses: Expense[];
  totalExpenses: number;
  periodExpenses: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  refreshData: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
}

export const useExpensesData = (): UseExpensesDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [periodExpenses, setPeriodExpenses] = useState<{
    daily: number;
    weekly: number;
    monthly: number;
  }>({
    daily: 0,
    weekly: 0,
    monthly: 0
  });
  
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      
      // Get all expenses for the list
      const allExpenses = await getExpenses();
      setExpenses(allExpenses);
      
      // Calculate total
      const total = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalExpenses(total);
      
      // Get period expenses
      const [daily, weekly, monthly] = await Promise.all([
        getDailyExpenses(),
        getWeeklyExpenses(),
        getMonthlyExpenses()
      ]);
      
      setPeriodExpenses({
        daily,
        weekly,
        monthly
      });
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
  
  const handleAddExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      await addExpense(expense);
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
    periodExpenses,
    refreshData,
    addExpense: handleAddExpense
  };
};
