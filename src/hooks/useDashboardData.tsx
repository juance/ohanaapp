
import { useState } from 'react';
import { useMetricsData, MetricsPeriod } from './useMetricsData';
import { useExpensesData } from './useExpensesData';
import { useClientData } from './useClientData';
import { useChartData } from './useChartData';
import { ClientVisit, DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';

interface UseDashboardDataReturn {
  loading: boolean;
  error: Error | null;
  metrics: {
    daily: DailyMetrics | null;
    weekly: WeeklyMetrics | null;
    monthly: MonthlyMetrics | null;
  };
  expenses: {
    daily: number;
    weekly: number;
    monthly: number;
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
  const [error, setError] = useState<Error | null>(null);
  
  // Use our separated hooks
  const metricsData = useMetricsData(period);
  const expensesData = useExpensesData();
  const clientData = useClientData();
  
  // Calculate chart data based on metrics and expenses
  const chartData = useChartData(period, metricsData.metrics, expensesData.expenses);
  
  // Determine overall loading state
  const loading = metricsData.loading || expensesData.loading || clientData.loading;
  
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
    error: error || metricsData.error || expensesData.error || clientData.error,
    metrics: metricsData.metrics,
    expenses: expensesData.expenses,
    frequentClients: clientData.frequentClients,
    chartData,
    refreshData
  };
};
