
import { useState, useEffect } from 'react';
import { 
  getMetrics,
  syncOfflineData
} from '@/lib/dataService';
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';

export type MetricsPeriod = 'daily' | 'weekly' | 'monthly';

interface MetricsData {
  daily: DailyMetrics;
  weekly: WeeklyMetrics;
  monthly: MonthlyMetrics;
  revenueByDate: Array<{ date: string; revenue: number }>;
  serviceBreakdown: Array<{ name: string; value: number }>;
  clientTypeBreakdown: Array<{ name: string; value: number }>;
  totalRevenue: number;
  totalTickets: number;
  uniqueCustomers: number;
  averageTicket: number;
}

interface UseMetricsDataReturn {
  data: MetricsData | null;
  isLoading: boolean;
  error: Error | null;
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  refreshData: () => Promise<void>;
}

export const useMetricsData = (): UseMetricsDataReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<MetricsData | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await syncOfflineData();
      
      // Use the combined getMetrics function instead of separate functions
      const metricsData = await getMetrics();
      
      const calculateTotalRevenue = (paymentMethods: Record<string, number | undefined>): number => {
        if (!paymentMethods) return 0;
        return Object.values(paymentMethods).reduce((sum: number, value) => sum + Number(value || 0), 0);
      };
      
      const daily = metricsData.daily;
      const totalDailyRevenue = calculateTotalRevenue(daily.paymentMethods);
      
      const weekly = metricsData.weekly;
      const totalWeeklyRevenue = calculateTotalRevenue(weekly.paymentMethods);
      
      const monthly = metricsData.monthly;
      const totalMonthlyRevenue = calculateTotalRevenue(monthly.paymentMethods);
      
      const revenueByDate: Array<{ date: string; revenue: number }> = [];
      const currentDate = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const revenue = Math.random() * 1000 + 500;
        revenueByDate.push({
          date: date.toISOString(),
          revenue
        });
      }
      
      const serviceBreakdown = Object.entries(monthly.dryCleaningItems || {}).map(([name, rawValue]) => {
        return {
          name,
          value: Number(rawValue || 0)
        };
      });
      
      const clientTypeBreakdown: Array<{ name: string; value: number }> = [
        { name: 'Regulares', value: 60 },
        { name: 'Ocasionales', value: 30 },
        { name: 'Nuevos', value: 10 }
      ];
      
      const totalTickets = 120;
      
      const totalMonthlyRevenueNumber = Number(totalMonthlyRevenue) || 0;
      
      setData({
        daily,
        weekly,
        monthly,
        revenueByDate,
        serviceBreakdown,
        clientTypeBreakdown,
        totalRevenue: totalMonthlyRevenueNumber,
        totalTickets,
        uniqueCustomers: 45,
        averageTicket: totalTickets > 0 ? (totalMonthlyRevenueNumber / totalTickets) : 0
      });
      
      console.log("Metrics data refreshed successfully:", {
        daily,
        weekly,
        monthly,
        revenueByDate,
        serviceBreakdown,
        clientTypeBreakdown
      });
      
      toast({
        title: "Success",
        description: "Datos de métricas actualizados"
      });
      
    } catch (err) {
      console.error("Error fetching metrics data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching data'));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los datos de métricas"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    refreshData();
  }, [dateRange.from, dateRange.to]);
  
  useEffect(() => {
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
