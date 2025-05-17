
import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { TicketAnalytics, DateRange } from '@/lib/analytics/interfaces';
import { fetchTicketsInDateRange, exportAnalyticsToCSV, calculateTicketAnalytics } from '@/lib/analytics/ticketAnalyticsService';
import { processTicketAnalyticsData } from '@/utils/analytics/ticketDataProcessor';
import { subDays } from 'date-fns';

export interface UseTicketAnalyticsReturn {
  data: TicketAnalytics;
  previousPeriodData: TicketAnalytics | null;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  isLoading: boolean;
  isComparativeLoading: boolean;
  error: Error | null;
  exportData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useTicketAnalytics = (): UseTicketAnalyticsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComparativeLoading, setIsComparativeLoading] = useState(false);
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

  const [previousPeriodData, setPreviousPeriodData] = useState<TicketAnalytics | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
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
          
          // After loading current data, fetch previous period data
          await fetchPreviousPeriodData(dateRange);
          
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
        
        // Even with no current data, try to fetch previous period
        await fetchPreviousPeriodData(dateRange);
        
        return;
      }

      const processedData = processTicketAnalyticsData(tickets, dryCleaningItems);
      
      setData(processedData);
      
      // After loading current data, fetch previous period data
      await fetchPreviousPeriodData(dateRange);
      
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

  const fetchPreviousPeriodData = async (currentRange: DateRange) => {
    if (!currentRange.from || !currentRange.to) return;
    
    setIsComparativeLoading(true);
    
    try {
      // Calculate the previous period with the same duration
      const currentDuration = currentRange.to.getTime() - currentRange.from.getTime();
      const previousFrom = new Date(currentRange.from.getTime() - currentDuration);
      const previousTo = new Date(currentRange.to.getTime() - currentDuration);
      
      // Try server-side calculation first for previous period
      try {
        const previousServerData = await calculateTicketAnalytics(previousFrom, previousTo);
        
        if (previousServerData) {
          setPreviousPeriodData(previousServerData);
          setIsComparativeLoading(false);
          return;
        }
      } catch (err) {
        console.log('Server-side calculation failed for previous period, falling back to client-side:', err);
      }
      
      // Fall back to client-side for previous period
      const { tickets: previousTickets, dryCleaningItems: previousItems } = 
        await fetchTicketsInDateRange(previousFrom, previousTo);
      
      if (!previousTickets || previousTickets.length === 0) {
        setPreviousPeriodData(null);
        setIsComparativeLoading(false);
        return;
      }
      
      const previousData = processTicketAnalyticsData(previousTickets, previousItems);
      setPreviousPeriodData(previousData);
      
    } catch (err) {
      console.error("Error fetching previous period analytics:", err);
      setPreviousPeriodData(null);
    } finally {
      setIsComparativeLoading(false);
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
    previousPeriodData,
    dateRange,
    setDateRange,
    isLoading,
    isComparativeLoading,
    error,
    exportData,
    refreshData: fetchData
  };
};
