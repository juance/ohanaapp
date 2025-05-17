
import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { TicketAnalytics, DateRange } from '@/lib/analytics/interfaces';
import { fetchTicketsInDateRange, exportAnalyticsToCSV, calculateTicketAnalytics } from '@/lib/analytics/ticketAnalyticsService';
import { processTicketAnalyticsData } from '@/utils/analytics/ticketDataProcessor';

export interface UseTicketAnalyticsReturn {
  data: TicketAnalytics;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  isLoading: boolean;
  error: Error | null;
  exportData: () => Promise<void>;
  refreshData: () => Promise<void>;
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
    setError(null);
    
    try {
      // Try to use server-side calculation first
      try {
        const serverData = await calculateTicketAnalytics(dateRange.from, dateRange.to);
        
        if (serverData) {
          setData(serverData);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.log('Server-side calculation failed, falling back to client-side:', err);
        // Continue with client-side calculation
      }
      
      // Fall back to client-side calculation
      const { tickets, dryCleaningItems } = await fetchTicketsInDateRange(dateRange.from, dateRange.to);
      
      if (!tickets || tickets.length === 0) {
        setData({
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
        setIsLoading(false);
        return;
      }

      const processedData = processTicketAnalyticsData(tickets, dryCleaningItems);
      
      setData(processedData);
    } catch (err) {
      console.error("Error fetching ticket analytics:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching analytics'));
      
      toast({
        variant: "destructive",
        title: "Error al cargar análisis",
        description: "No se pudieron cargar los datos de análisis."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const exportData = async () => {
    try {
      await exportAnalyticsToCSV(data);
      toast({
        title: "Exportación exitosa",
        description: "Los datos han sido exportados correctamente."
      });
      return Promise.resolve();
    } catch (error) {
      console.error('Error exporting data:', error);
      
      toast({
        variant: "destructive",
        title: "Error al exportar",
        description: "No se pudieron exportar los datos."
      });
      
      return Promise.reject(error);
    }
  };

  return {
    data,
    dateRange,
    setDateRange,
    isLoading,
    error,
    exportData,
    refreshData: fetchData
  };
};
