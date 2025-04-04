
import { useState, useEffect } from 'react';
import { 
  getDailyMetrics, 
  getWeeklyMetrics, 
  getMonthlyMetrics,
  getClientVisitFrequency,
  syncOfflineData
} from '@/lib/dataService';
import { getStoredExpenses } from '@/lib/expenseService';
import { ClientVisit, DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';

type MetricsPeriod = 'daily' | 'weekly' | 'monthly';

interface UseDashboardDataReturn {
  loading: boolean;
  error: Error | null;
  metrics: {
    daily: DailyMetrics | null;
    weekly: WeeklyMetrics | null;
    monthly: MonthlyMetrics | null;
  };
  expenses: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  frequentClients: ClientVisit[];
  chartData: {
    barData: { name: string; total: number }[];
    lineData: { name: string; income: number; expenses: number }[];
    pieData: { name: string; value: number }[];
  };
  refreshData: () => Promise<void>;
}

export const useDashboardData = (period: MetricsPeriod = 'daily'): UseDashboardDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics | null>(null);
  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyMetrics | null>(null);
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetrics | null>(null);
  const [frequentClients, setFrequentClients] = useState<ClientVisit[]>([]);
  const [expenses, setExpenses] = useState<{daily: number; weekly: number; monthly: number}>({
    daily: 0,
    weekly: 0,
    monthly: 0
  });
  
  // Function to get expenses for different periods
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
    }
  };
  
  // Prepare chart data based on metrics
  const getBarChartData = () => {
    if (period === 'daily') {
      // For daily, we may not have hourly data from the database
      // So we'll use mock data or empty data
      return [
        { name: '8am', total: 0 },
        { name: '10am', total: 0 },
        { name: '12pm', total: 0 },
        { name: '2pm', total: 0 },
        { name: '4pm', total: 0 },
        { name: '6pm', total: 0 },
      ];
    } else if (period === 'weekly' && weeklyMetrics) {
      // Convert weekly data to chart format
      return Object.entries(weeklyMetrics.salesByDay).map(([day, total]) => ({
        name: day.substring(0, 3),  // Abbreviate day names
        total
      }));
    } else if (period === 'monthly' && monthlyMetrics) {
      // Convert monthly data to chart format
      return Object.entries(monthlyMetrics.salesByWeek).map(([week, total]) => ({
        name: week,
        total
      }));
    }
    
    return [];
  };
  
  const getLineChartData = () => {
    if (period === 'weekly' && weeklyMetrics) {
      // Now include actual expenses data
      return Object.entries(weeklyMetrics.salesByDay).map(([day, income]) => {
        // Since we don't have daily breakdown of expenses, we'll distribute weekly expenses evenly
        const dailyExpenseEstimate = expenses.weekly / 7;
        
        return {
          name: day.substring(0, 3),
          income,
          expenses: dailyExpenseEstimate
        };
      });
    } else if (period === 'monthly' && monthlyMetrics) {
      return Object.entries(monthlyMetrics.salesByWeek).map(([week, income]) => {
        // Distribute monthly expenses across weeks
        const weeklyExpenseEstimate = expenses.monthly / 4;
        
        return {
          name: week,
          income,
          expenses: weeklyExpenseEstimate
        };
      });
    }
    
    // Default data
    return [
      { name: 'Week 1', income: 21000, expenses: expenses.monthly / 4 || 6500 },
      { name: 'Week 2', income: 27000, expenses: expenses.monthly / 4 || 7800 },
      { name: 'Week 3', income: 24000, expenses: expenses.monthly / 4 || 6200 },
      { name: 'Week 4', income: 26000, expenses: expenses.monthly / 4 || 7100 },
    ];
  };
  
  const getPieChartData = () => {
    let dryCleaningItems: Record<string, number> = {};
    
    if (period === 'daily' && dailyMetrics) {
      dryCleaningItems = dailyMetrics.dryCleaningItems;
    } else if (period === 'weekly' && weeklyMetrics) {
      dryCleaningItems = weeklyMetrics.dryCleaningItems;
    } else if (period === 'monthly' && monthlyMetrics) {
      dryCleaningItems = monthlyMetrics.dryCleaningItems;
    }
    
    // Convert to chart format
    return Object.entries(dryCleaningItems).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to sync any offline data
      await syncOfflineData();
      
      // Fetch data based on selected period
      const [daily, weekly, monthly, clients] = await Promise.all([
        getDailyMetrics(),
        getWeeklyMetrics(),
        getMonthlyMetrics(),
        getClientVisitFrequency()
      ]);
      
      setDailyMetrics(daily);
      setWeeklyMetrics(weekly);
      setMonthlyMetrics(monthly);
      setFrequentClients(clients);
      
      // Fetch expenses
      await fetchExpenses();
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching data'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    refreshData();
  }, []);
  
  return {
    loading,
    error,
    metrics: {
      daily: dailyMetrics,
      weekly: weeklyMetrics,
      monthly: monthlyMetrics
    },
    expenses,
    frequentClients,
    chartData: {
      barData: getBarChartData(),
      lineData: getLineChartData(),
      pieData: getPieChartData()
    },
    refreshData
  };
};
