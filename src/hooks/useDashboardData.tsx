
import { useState, useEffect } from 'react';
import { useExpensesData } from './useExpensesData';
import { useClientData } from './useClientData';
import { useChartData } from './useChartData';
import { ClientVisit } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface UseDashboardDataReturn {
  isLoading: boolean;
  error: Error | null;
  data: {
    metrics: any;
    expenses: any;
    clients: ClientVisit[];
    chartData: {
      barData: any[];
      lineData: any[];
      pieData: any[];
    };
  };
  refreshData: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [error, setError] = useState<Error | null>(null);
  const [metricsData, setMetricsData] = useState<any>({
    daily: null,
    weekly: null,
    monthly: {
      totalTickets: 0,
      paidTickets: 0, // Reset to zero
      totalRevenue: 0,
      salesByWeek: {
        'Week 1': 0,
        'Week 2': 0,
        'Week 3': 0,
        'Week 4': 0
      },
      dryCleaningItems: {}
    }
  });
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  
  // Use our separated hooks
  const expensesData = useExpensesData();
  const clientData = useClientData();
  
  // Calculate chart data based on metrics data and the current period
  const period = 'monthly'; // Default to monthly
  const chartData = useChartData(
    period,
    {
      daily: metricsData.daily || null,
      weekly: metricsData.weekly || null,
      monthly: metricsData.monthly || null
    },
    {
      daily: Number(expensesData.expenses?.daily || 0),
      weekly: Number(expensesData.expenses?.weekly || 0),
      monthly: Number(expensesData.expenses?.monthly || 0)
    }
  );
  
  // Simulate metrics data loading
  const refreshMetricsData = async () => {
    setIsMetricsLoading(true);
    try {
      // In a real app, this would fetch data from an API
      // For now, we'll just simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sample data with paidTickets set to 0
      const sampleMetrics = {
        daily: null,
        weekly: null,
        monthly: {
          totalTickets: 125,
          paidTickets: 0, // Reset to zero (was 102)
          totalRevenue: 15780,
          salesByWeek: {
            'Week 1': 3450,
            'Week 2': 4230,
            'Week 3': 3890,
            'Week 4': 4210
          },
          dryCleaningItems: {
            'Camisas': 45,
            'Pantalones': 38,
            'Vestidos': 22,
            'Sacos': 15,
            'Otros': 5
          }
        }
      };
      
      setMetricsData(sampleMetrics);
    } catch (err) {
      console.error("Error fetching metrics data:", err);
      setError(err instanceof Error ? err : new Error('Error fetching metrics data'));
    } finally {
      setIsMetricsLoading(false);
    }
  };
  
  // Determine overall loading state
  const isLoading = isMetricsLoading || expensesData.loading || clientData.loading;
  
  // Function to refresh all data
  const refreshData = async () => {
    try {
      toast.info("Actualizando datos del panel...");
      
      await Promise.all([
        refreshMetricsData(),
        expensesData.refreshData(),
        clientData.refreshData()
      ]);
      
      toast.success("Datos del panel actualizados correctamente");
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error refreshing data'));
      toast.error("Error al actualizar los datos del panel");
    }
  };
  
  // Initial load of data
  useEffect(() => {
    refreshData();
  }, []);
  
  // Combine data for component consumption
  const combinedData = {
    metrics: metricsData || {},
    expenses: expensesData.expenses || { daily: 0, weekly: 0, monthly: 0 },
    clients: clientData.frequentClients || [],
    chartData: chartData || { barData: [], lineData: [], pieData: [] }
  };
  
  return {
    isLoading,
    error: error || expensesData.error || clientData.error,
    data: combinedData,
    refreshData
  };
};
