
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
      
      // Implement a try-catch to handle potential mismatch in function signature
      let dailyExpenses = [];
      try {
        dailyExpenses = await getStoredExpenses();
        // Filter for today's expenses only
        dailyExpenses = dailyExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= startOfDay && expDate <= endOfDay;
        });
      } catch (err) {
        console.error("Error fetching daily expenses:", err);
        dailyExpenses = [];
      }
      
      const dailyTotal = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Get expenses for current week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
      endOfWeek.setHours(23, 59, 59, 999);
      
      // Try-catch for weekly expenses
      let weeklyExpenses = [];
      try {
        weeklyExpenses = await getStoredExpenses();
        // Filter for this week's expenses
        weeklyExpenses = weeklyExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= startOfWeek && expDate <= endOfWeek;
        });
      } catch (err) {
        console.error("Error fetching weekly expenses:", err);
        weeklyExpenses = [];
      }
      
      const weeklyTotal = weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Get expenses for current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      // Try-catch for monthly expenses
      let monthlyExpenses = [];
      try {
        monthlyExpenses = await getStoredExpenses();
        // Filter for this month's expenses
        monthlyExpenses = monthlyExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= startOfMonth && expDate <= endOfMonth;
        });
      } catch (err) {
        console.error("Error fetching monthly expenses:", err);
        monthlyExpenses = [];
      }
      
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
