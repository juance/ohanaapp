
import { useState, useEffect } from 'react';
import { getTicketAnalytics, TicketAnalytics } from '@/lib/analyticsService';

interface UseTicketAnalyticsReturn {
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  analytics: TicketAnalytics | null;
  metrics: any;
  chartData: any;
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  exportData: () => Promise<void>;
  refreshData: (startDate?: Date, endDate?: Date) => Promise<void>;
}

export const useTicketAnalytics = (
  initialStartDate: Date = new Date(new Date().setDate(new Date().getDate() - 30)),
  initialEndDate: Date = new Date()
): UseTicketAnalyticsReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<TicketAnalytics | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: initialStartDate,
    to: initialEndDate
  });
  
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
    fetchAnalytics(dateRange.from, dateRange.to);
  }, [dateRange.from, dateRange.to]);
  
  const refreshData = async (startDate?: Date, endDate?: Date) => {
    await fetchAnalytics(startDate, endDate);
  };
  
  const exportData = async () => {
    console.log("Exporting data...");
    // Implementation would go here
  };
  
  return {
    loading,
    isLoading: loading,
    error,
    analytics,
    metrics: analytics?.metrics || {},
    chartData: analytics?.chartData || {},
    dateRange,
    setDateRange,
    exportData,
    refreshData
  };
};
