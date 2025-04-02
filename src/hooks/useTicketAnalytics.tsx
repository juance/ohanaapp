
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  fetchTicketAnalytics, 
  TicketAnalytics, 
  DateRange 
} from '@/lib/analytics/ticketAnalyticsService';
import { exportAnalyticsToCSV } from '@/lib/analytics/ticketDataExport';

export interface UseTicketAnalyticsReturn {
  data: TicketAnalytics;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  isLoading: boolean;
  error: Error | null;
  exportData: () => Promise<void>;
}

export const useTicketAnalytics = (): UseTicketAnalyticsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TicketAnalytics>({
    totalTickets: 0,
    averageTicketValue: 0,
    totalRevenue: 0,
    ticketsByStatus: {
      pending: 0,
      processing: 0,
      ready: 0,
      delivered: 0
    },
    topServices: [],
    revenueByMonth: [],
    itemTypeDistribution: {},
    paymentMethodDistribution: {},
    freeValets: 0,
    paidTickets: 0
  });
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const analyticsData = await fetchTicketAnalytics(dateRange);
      setData(analyticsData);
      setError(null);
    } catch (err) {
      console.error("Error in useTicketAnalytics:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching analytics'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const exportData = async () => {
    try {
      toast("Exportando datos...");
      await exportAnalyticsToCSV(data);
      toast("Datos exportados correctamente");
      return Promise.resolve();
    } catch (error) {
      console.error('Error exporting data:', error);
      toast("Error al exportar los datos");
      return Promise.reject(error);
    }
  };

  return {
    data,
    dateRange,
    setDateRange,
    isLoading,
    error,
    exportData
  };
};
