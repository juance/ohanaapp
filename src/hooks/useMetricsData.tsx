
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
  data: any;
  isLoading: boolean;
  error: Error | null;
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  refreshData: () => Promise<void>;
}

export const useMetricsData = (): UseMetricsDataReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to sync any offline data
      await syncOfflineData();
      
      // Fetch data based on selected period
      const period = determinePeriod(dateRange.from, dateRange.to);
      let metricsData;
      
      switch(period) {
        case 'daily':
          metricsData = await getDailyMetrics();
          break;
        case 'weekly':
          metricsData = await getWeeklyMetrics();
          break;
        case 'monthly':
          metricsData = await getMonthlyMetrics();
          break;
        default:
          metricsData = await getDailyMetrics();
      }
      
      setData(metricsData);
    } catch (err) {
      console.error("Error fetching metrics data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching data'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine period based on date range
  const determinePeriod = (from: Date, to: Date): MetricsPeriod => {
    const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 'daily';
    if (diffDays <= 31) return 'weekly';
    return 'monthly';
  };
  
  useEffect(() => {
    refreshData();
  }, [dateRange.from, dateRange.to]);
  
  return {
    data,
    isLoading,
    error,
    dateRange,
    setDateRange,
    refreshData
  };
};
