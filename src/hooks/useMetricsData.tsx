
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
      
      // Calculate total revenue from payment methods
      const calculateTotalRevenue = (paymentMethods: any): number => {
        if (!paymentMethods) return 0;
        return Object.values(paymentMethods).reduce((sum: number, value: any) => sum + Number(value || 0), 0);
      };
      
      // Process daily metrics
      const daily = dailyMetrics;
      const totalDailyRevenue = calculateTotalRevenue(daily.paymentMethods);
      
      // Process weekly metrics
      const weekly = weeklyMetrics;
      const totalWeeklyRevenue = calculateTotalRevenue(weekly.paymentMethods);
      
      // Process monthly metrics
      const monthly = monthlyMetrics;
      const totalMonthlyRevenue = calculateTotalRevenue(monthly.paymentMethods);
      
      // Prepare revenue by date chart data
      const revenueByDate: Array<{ date: string; revenue: number }> = [];
      const currentDate = new Date();
      
      // Add data points for the last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        // Simple mock data - we'll replace this with real data when available
        const revenue = Math.random() * 1000 + 500; // Random value between 500 and 1500
        revenueByDate.push({
          date: date.toISOString(),
          revenue
        });
      }
      
      // Prepare service breakdown data
      const serviceBreakdown: Array<{ name: string; value: number }> = [];
      if (monthly.dryCleaningItems) {
        Object.entries(monthly.dryCleaningItems).forEach(([name, value]) => {
          serviceBreakdown.push({
            name,
            value: Number(value)
          });
        });
      }
      
      // Prepare client type breakdown
      const clientTypeBreakdown: Array<{ name: string; value: number }> = [
        { name: 'Regulares', value: 60 },
        { name: 'Ocasionales', value: 30 },
        { name: 'Nuevos', value: 10 }
      ];
      
      // Calculate totalTickets and ensure it's a number
      const totalTickets: number = 120; // Mock data for now
      
      // Ensure totalMonthlyRevenue is a number before division
      const totalMonthlyRevenueNum: number = Number(totalMonthlyRevenue) || 0;
      
      // Set all the metrics data, ensuring proper numeric types
      setData({
        daily,
        weekly,
        monthly,
        revenueByDate,
        serviceBreakdown,
        clientTypeBreakdown,
        totalRevenue: totalMonthlyRevenueNum,
        totalTickets,
        uniqueCustomers: 45, // Mock data
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
