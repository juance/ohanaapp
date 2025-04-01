
import { useState, useEffect } from 'react';
import { 
  getDailyMetrics, 
  getWeeklyMetrics, 
  getMonthlyMetrics,
  syncOfflineData
} from '@/lib/dataService';
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';

export type MetricsPeriod = 'daily' | 'weekly' | 'monthly';

interface UseMetricsDataReturn {
  loading: boolean;
  error: Error | null;
  metrics: {
    daily: DailyMetrics | null;
    weekly: WeeklyMetrics | null;
    monthly: MonthlyMetrics | null;
  };
  refreshData: () => Promise<void>;
}

export const useMetricsData = (period: MetricsPeriod = 'daily'): UseMetricsDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics | null>(null);
  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyMetrics | null>(null);
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetrics | null>(null);
  
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to sync any offline data
      await syncOfflineData();
      
      // Fetch data based on selected period
      const [daily, weekly, monthly] = await Promise.all([
        getDailyMetrics(),
        getWeeklyMetrics(),
        getMonthlyMetrics()
      ]);
      
      setDailyMetrics(daily);
      setWeeklyMetrics(weekly);
      setMonthlyMetrics(monthly);
    } catch (err) {
      console.error("Error fetching metrics data:", err);
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
    refreshData
  };
};
