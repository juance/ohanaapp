
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
      await syncOfflineData();
      
      const [dailyMetrics, weeklyMetrics, monthlyMetrics] = await Promise.all([
        getDailyMetrics(),
        getWeeklyMetrics(),
        getMonthlyMetrics()
      ]);
      
      const calculateTotalRevenue = (paymentMethods: any): number => {
        if (!paymentMethods) return 0;
        return Object.values(paymentMethods).reduce((sum: number, value: any) => sum + Number(value || 0), 0);
      };
      
      const daily = dailyMetrics;
      const totalDailyRevenue = calculateTotalRevenue(daily.paymentMethods);
      
      const weekly = weeklyMetrics;
      const totalWeeklyRevenue = calculateTotalRevenue(weekly.paymentMethods);
      
      const monthly = monthlyMetrics;
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
      
      const serviceBreakdown: Array<{ name: string; value: number }> = [];
      if (monthly.dryCleaningItems) {
        Object.entries(monthly.dryCleaningItems).forEach(([name, value]) => {
          // Fix the type error by explicitly casting value to number
          const numericValue = Number(value || 0);
          serviceBreakdown.push({
            name,
            value: numericValue
          });
        });
      }
      
      const clientTypeBreakdown: Array<{ name: string; value: number }> = [
        { name: 'Regulares', value: 60 },
        { name: 'Ocasionales', value: 30 },
        { name: 'Nuevos', value: 10 }
      ];
      
      const totalTickets: number = 120;
      
      const totalMonthlyRevenueNum: number = Number(totalMonthlyRevenue) || 0;
      
      setData({
        daily,
        weekly,
        monthly,
        revenueByDate,
        serviceBreakdown,
        clientTypeBreakdown,
        totalRevenue: totalMonthlyRevenueNum,
        totalTickets,
        uniqueCustomers: 45,
        averageTicket: totalTickets > 0 ? (totalMonthlyRevenueNum / totalTickets) : 0
      });
      
      console.log("Metrics data refreshed successfully:", {
        daily,
        weekly,
        monthly,
        revenueByDate,
        serviceBreakdown,
        clientTypeBreakdown
      });
      
      toast.success("Datos de métricas actualizados");
      
    } catch (err) {
      console.error("Error fetching metrics data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching data'));
      toast.error("Error al cargar los datos de métricas");
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
