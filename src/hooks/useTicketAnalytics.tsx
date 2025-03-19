
import { useState, useEffect } from 'react';
import { getTicketAnalytics, TicketAnalytics } from '@/lib/analyticsService';

interface UseTicketAnalyticsReturn {
  loading: boolean;
  error: Error | null;
  analytics: TicketAnalytics | null;
  refreshData: (startDate?: Date, endDate?: Date) => Promise<void>;
}

export const useTicketAnalytics = (
  initialStartDate?: Date,
  initialEndDate?: Date
): UseTicketAnalyticsReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<TicketAnalytics | null>(null);
  
  const fetchAnalytics = async (startDate?: Date, endDate?: Date) => {
    try {
      setLoading(true);
      const data = await getTicketAnalytics(startDate, endDate);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching ticket analytics:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching analytics'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnalytics(initialStartDate, initialEndDate);
  }, [initialStartDate, initialEndDate]);
  
  const refreshData = async (startDate?: Date, endDate?: Date) => {
    await fetchAnalytics(startDate, endDate);
  };
  
  return {
    loading,
    error,
    analytics,
    refreshData
  };
};
