
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useCallback } from 'react';

// Define the return type for the hook
interface UseDashboardDataReturn {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  dateRange: { start: Date, end: Date };
  setDateRange: (range: { start: Date, end: Date }) => void;
  ticketsInRange: any[];
  incomeInRange: number;
  serviceCounts: Record<string, number>;
  dryCleaningItems: Record<string, number>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setHours(0, 0, 0, 0)),
    end: new Date(new Date().setHours(23, 59, 59, 999))
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      // Convertir a formato ISO para queries de Supabase
      const rangeStartISO = dateRange.start.toISOString();
      const rangeEndISO = dateRange.end.toISOString();

      // Get tickets in custom date range
      const { data: rangeTicketsData, error: rangeTicketsError } = await supabase
        .from('tickets')
        .select('*')
        .gte('created_at', rangeStartISO)
        .lte('created_at', rangeEndISO);
      
      if (rangeTicketsError) throw rangeTicketsError;

      // Process data
      const rangeIncome = calculateTotalIncome(rangeTicketsData || []);
      
      // Count services
      const serviceCounts = countServices(rangeTicketsData || []);
      
      // Count dry cleaning items
      const dryCleaningItems = countDryCleaningItems(rangeTicketsData || []);

      return {
        ticketsInRange: rangeTicketsData || [],
        incomeInRange: rangeIncome,
        serviceCounts,
        dryCleaningItems
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }, [dateRange]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboardData', dateRange],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  });

  const calculateTotalIncome = (tickets: any[]): number => {
    return tickets.reduce((acc, ticket) => {
      // Ignore cancelled tickets
      if (ticket.status === 'canceled' || ticket.status === 'cancelled') {
        return acc;
      }
      return acc + (ticket.total_price || 0);
    }, 0);
  };

  const countServices = (tickets: any[]): Record<string, number> => {
    const counts: Record<string, number> = {
      valet: 0,
      lavanderia: 0,
      tintoreria: 0
    };

    tickets.forEach(ticket => {
      // Ignore cancelled tickets
      if (ticket.status === 'canceled' || ticket.status === 'cancelled') {
        return;
      }

      // Count by service type
      if (ticket.service_type === 'valet') {
        counts.valet++;
      } else if (ticket.service_type === 'lavanderia') {
        counts.lavanderia++;
      } else if (ticket.service_type === 'tintoreria') {
        counts.tintoreria++;
      }
    });

    return counts;
  };

  const countDryCleaningItems = (tickets: any[]): Record<string, number> => {
    const dryCleaningItems: Record<string, number> = {};

    tickets.forEach(ticket => {
      // Ignore cancelled tickets
      if (ticket.status === 'canceled' || ticket.status === 'cancelled') {
        return;
      }
      
      // Try to get dry cleaning items
      try {
        // Fetch dry cleaning items for this ticket
        const dryCleaningItemsData = Array.isArray((ticket as any).dry_cleaning_items) ? (ticket as any).dry_cleaning_items : [];

        if (dryCleaningItemsData.length > 0) {
          dryCleaningItemsData.forEach((item: any) => {
            dryCleaningItems[item.name] = (dryCleaningItems[item.name] || 0) + (item.quantity || 1);
          });
        }
      } catch (e) {
        console.error('Error processing dry cleaning items:', e);
      }
    });

    return dryCleaningItems;
  };

  return {
    isLoading,
    isError,
    error,
    refetch,
    dateRange,
    setDateRange,
    ticketsInRange: data?.ticketsInRange || [],
    incomeInRange: data?.incomeInRange || 0,
    serviceCounts: data?.serviceCounts || { valet: 0, lavanderia: 0, tintoreria: 0 },
    dryCleaningItems: data?.dryCleaningItems || {}
  };
};
