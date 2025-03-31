import { useState, useEffect } from 'react';
import { getMetrics } from '@/lib/analyticsService';
import { toast } from '@/hooks/use-toast';

interface UseMetricsDataReturn {
  isLoading: boolean;
  error: Error | null;
  data: any | null;
  refreshData: () => Promise<void>;
}

export const useMetricsData = (): UseMetricsDataReturn => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const metricsData = await getMetrics();
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
  }, []);
  
  return {
    isLoading,
    error,
    data,
    refreshData
  };
};
