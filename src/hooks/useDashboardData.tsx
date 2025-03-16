
import { useState, useEffect } from 'react';
import { 
  getDailyMetrics, 
  getWeeklyMetrics, 
  getMonthlyMetrics,
  getClientVisitFrequency,
  syncOfflineData
} from '@/lib/dataService';
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
      // We don't have expense data by day in this example
      // This could be enhanced when expense tracking is implemented
      return Object.entries(weeklyMetrics.salesByDay).map(([day, income]) => ({
        name: day.substring(0, 3),
        income,
        expenses: 0 // Placeholder for expenses
      }));
    } else if (period === 'monthly' && monthlyMetrics) {
      return Object.entries(monthlyMetrics.salesByWeek).map(([week, income]) => ({
        name: week,
        income,
        expenses: 0 // Placeholder for expenses
      }));
    }
    
    // Default data
    return [
      { name: 'Week 1', income: 21000, expenses: 6500 },
      { name: 'Week 2', income: 27000, expenses: 7800 },
      { name: 'Week 3', income: 24000, expenses: 6200 },
      { name: 'Week 4', income: 26000, expenses: 7100 },
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
    frequentClients,
    chartData: {
      barData: getBarChartData(),
      lineData: getLineChartData(),
      pieData: getPieChartData()
    },
    refreshData
  };
};
