
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useCallback } from 'react';
import { toast } from '@/lib/toast';

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
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('Fetching dashboard data for date range:', {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString()
      });
      
      // Convert to ISO format for Supabase queries
      const rangeStartISO = dateRange.start.toISOString();
      const rangeEndISO = dateRange.end.toISOString();

      // Get tickets in custom date range with customer info and dry cleaning items
      const { data: rangeTicketsData, error: rangeTicketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          customers (name, phone),
          dry_cleaning_items (id, name, quantity, price)
        `)
        .gte('created_at', rangeStartISO)
        .lte('created_at', rangeEndISO)
        .order('created_at', { ascending: false });
      
      if (rangeTicketsError) {
        console.error('Error fetching tickets:', rangeTicketsError);
        throw rangeTicketsError;
      }

      console.log(`Fetched ${rangeTicketsData?.length || 0} tickets`);
      
      // Process data
      const validTickets = rangeTicketsData?.filter(ticket => 
        !ticket.is_canceled && ticket.status !== 'canceled' && ticket.status !== 'cancelled'
      ) || [];
      
      const rangeIncome = calculateTotalIncome(validTickets);
      
      // Count services
      const serviceCounts = countServices(validTickets);
      
      // Count dry cleaning items
      const dryCleaningItems = countDryCleaningItems(validTickets);

      return {
        ticketsInRange: validTickets,
        incomeInRange: rangeIncome,
        serviceCounts,
        dryCleaningItems
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error al cargar datos del dashboard');
      throw error;
    }
  }, [dateRange]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboardData', dateRange.start.toISOString(), dateRange.end.toISOString()],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2
  });

  const calculateTotalIncome = (tickets: any[]): number => {
    return tickets.reduce((acc, ticket) => {
      // Ignore cancelled tickets
      if (ticket.status === 'canceled' || ticket.status === 'cancelled') {
        return acc;
      }
      return acc + (Number(ticket.total) || 0);
    }, 0);
  };

  const countServices = (tickets: any[]): Record<string, number> => {
    const counts: Record<string, number> = {
      valet: 0,
      lavanderia: 0,
      tintoreria: 0
    };

    tickets.forEach(ticket => {
      // Count by valet quantity for valet tickets
      if (ticket.valet_quantity > 0) {
        counts.valet += ticket.valet_quantity;
      }
      
      // Count dry cleaning items
      if (ticket.dry_cleaning_items && ticket.dry_cleaning_items.length > 0) {
        counts.tintoreria++;
      }
      
      // If it's not a valet or dry cleaning, count as laundry
      if (ticket.valet_quantity === 0 && 
          (!ticket.dry_cleaning_items || ticket.dry_cleaning_items.length === 0)) {
        counts.lavanderia++;
      }
    });

    return counts;
  };

  const countDryCleaningItems = (tickets: any[]): Record<string, number> => {
    const dryCleaningItems: Record<string, number> = {};

    tickets.forEach(ticket => {
      // Process dry cleaning items if available
      if (ticket.dry_cleaning_items && Array.isArray(ticket.dry_cleaning_items)) {
        ticket.dry_cleaning_items.forEach((item: any) => {
          if (item && item.name) {
            dryCleaningItems[item.name] = (dryCleaningItems[item.name] || 0) + (item.quantity || 1);
          }
        });
      }

      // Add valet entries for pie chart
      if (ticket.valet_quantity > 0) {
        dryCleaningItems['Valet'] = (dryCleaningItems['Valet'] || 0) + ticket.valet_quantity;
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
