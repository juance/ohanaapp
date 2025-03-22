
import { useState } from 'react';
import { useMetricsData } from './useMetricsData';
import { useExpensesData } from './useExpensesData';
import { useClientData } from './useClientData';
import { useChartData } from './useChartData';
import { ClientVisit } from '@/lib/types';

interface UseDashboardDataReturn {
  loading: boolean;
  error: Error | null;
  data: any;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [error, setError] = useState<Error | null>(null);
  
  // Use our separated hooks
  const metricsData = useMetricsData();
  const expensesData = useExpensesData();
  const clientData = useClientData();
  
  // Calculate chart data based on metrics and expenses
  const chartData = useChartData(metricsData.data);
  
  // Determine overall loading state
  const loading = expensesData.loading || clientData.loading;
  const isLoading = metricsData.isLoading || loading;
  
  // Function to refresh all data
  const refreshData = async () => {
    try {
      await Promise.all([
        metricsData.refreshData(),
        expensesData.refreshData(),
        clientData.refreshData()
      ]);
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error refreshing data'));
    }
  };
  
  return {
    loading,
    isLoading,
    error: error || metricsData.error || expensesData.error || clientData.error,
    data: metricsData.data,
    refreshData
  };
};
