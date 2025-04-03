
import { useState, useEffect } from 'react';
import { useMetricsData } from './useMetricsData';
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
  
  const metricsData = useMetricsData();
  const expensesData = useExpensesData();
  const clientData = useClientData();
  
  const period = 'monthly';
  const chartData = useChartData(
    period,
    {
      daily: metricsData.data?.daily || null,
      weekly: metricsData.data?.weekly || null,
      monthly: metricsData.data?.monthly || null
    },
    {
      daily: Number(expensesData.periodExpenses?.daily || 0),
      weekly: Number(expensesData.periodExpenses?.weekly || 0),
      monthly: Number(expensesData.periodExpenses?.monthly || 0)
    }
  );
  
  const isLoading = metricsData.isLoading || expensesData.loading || clientData.loading;
  
  const refreshData = async () => {
    try {
      toast.toast("Actualizando datos del panel...");
      
      await Promise.all([
        metricsData.refreshData(),
        expensesData.refreshData(),
        clientData.refreshData()
      ]);
      
      toast.success("Datos del panel actualizados correctamente");
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error refreshing data'));
      toast.error("Error", "Error al actualizar los datos del panel");
    }
  };
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await refreshData();
      } catch (err) {
        console.error("Error in initial data fetch:", err);
      }
    };
    
    fetchInitialData();
  }, []);
  
  const combinedData = {
    metrics: metricsData.data || {},
    expenses: expensesData.periodExpenses || { daily: 0, weekly: 0, monthly: 0 },
    clients: clientData.frequentClients || [],
    chartData: chartData || { barData: [], lineData: [], pieData: [] }
  };
  
  return {
    isLoading,
    error: error || metricsData.error || expensesData.error || clientData.error,
    data: combinedData,
    refreshData
  };
};
