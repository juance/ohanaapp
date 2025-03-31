
import { useState, useEffect } from 'react';
import { getMetrics } from '@/lib/analyticsService';
import { toast } from '@/hooks/use-toast';

export type MetricsPeriod = 'daily' | 'weekly' | 'monthly';

interface DateRange {
  from: Date;
  to: Date;
}

interface UseMetricsDataReturn {
  isLoading: boolean;
  error: Error | null;
  data: any | null;
  refreshData: () => Promise<void>;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

export const useMetricsData = (): UseMetricsDataReturn => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const metricsData = await getMetrics(dateRange);
      setData(metricsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching metrics data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching metrics'));
      toast.error("Error al cargar las métricas. Por favor, inténtelo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    refreshData();
  }, [dateRange]);
  
  return {
    isLoading,
    error,
    data,
    refreshData,
    dateRange,
    setDateRange
  };
};
