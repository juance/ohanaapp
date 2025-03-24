
import { useState, useEffect } from 'react';
import { 
  getDailyMetrics, 
  getWeeklyMetrics, 
  getMonthlyMetrics,
  syncOfflineData
} from '@/lib/dataService';
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
      // Try to sync any offline data first
      await syncOfflineData();
      
      // Fetch all metrics for different time periods in parallel
      const [dailyMetrics, weeklyMetrics, monthlyMetrics] = await Promise.all([
        getDailyMetrics(),
        getWeeklyMetrics(),
        getMonthlyMetrics()
      ]);
      
      // Set all the metrics data
      setData({
        daily: dailyMetrics,
        weekly: weeklyMetrics,
        monthly: monthlyMetrics
      });
      
      console.log("Metrics data refreshed successfully:", {
        daily: dailyMetrics,
        weekly: weeklyMetrics,
        monthly: monthlyMetrics
      });
      
    } catch (err) {
      console.error("Error fetching metrics data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching data'));
      toast.error("Error al cargar los datos de métricas");
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
  
  // Refresh data when dateRange changes
  useEffect(() => {
    refreshData();
  }, [dateRange.from, dateRange.to]);
  
  // Set up subscription to database changes for real-time updates
  useEffect(() => {
    // Create a subscription to the tickets table
    const channel = supabase
      .channel('metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets'
        },
        (payload) => {
          console.log('Tickets table changed, refreshing metrics data:', payload);
          refreshData();
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return {
    data,
    isLoading,
    error,
    dateRange,
    setDateRange,
    refreshData
  };
};
