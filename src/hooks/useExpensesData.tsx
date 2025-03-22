import { useState, useEffect } from 'react';
import { getStoredExpenses } from '@/lib/dataService';

interface UseExpensesDataReturn {
  loading: boolean;
  error: Error | null;
  expenses: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  refreshData: () => Promise<void>;
}

export const useExpensesData = (): UseExpensesDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [expenses, setExpenses] = useState<{daily: number; weekly: number; monthly: number}>({
    daily: 0,
    weekly: 0,
    monthly: 0
  });
  
  const fetchExpenses = async () => {
    try {
      // Get current date
      const today = new Date();
      
      // Get expenses for today
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      
      const dailyExpenses = await getStoredExpenses(startOfDay, endOfDay);
      const dailyTotal = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Get expenses for current week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
      endOfWeek.setHours(23, 59, 59, 999);
      
      const weeklyExpenses = await getStoredExpenses(startOfWeek, endOfWeek);
      const weeklyTotal = weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Get expenses for current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      const monthlyExpenses = await getStoredExpenses(startOfMonth, endOfMonth);
      const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      setExpenses({
        daily: dailyTotal,
        weekly: weeklyTotal,
        monthly: monthlyTotal
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
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  return {
    loading,
    error,
    expenses,
    refreshData
  };
};
