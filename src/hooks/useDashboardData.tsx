
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useCallback } from 'react';

// Define the return type for the hook
interface UseDashboardDataReturn {
  todayTickets: number;
  todayIncome: number;
  pendingTickets: number;
  totalTickets: number;
  totalIncome: number;
  serviceCounts: Record<string, number>;
  dryCleaningItems: Record<string, number>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  dateRange: { start: Date, end: Date };
  setDateRange: (range: { start: Date, end: Date }) => void;
  ticketsInRange: any[];
  incomeInRange: number;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setHours(0, 0, 0, 0)),
    end: new Date(new Date().setHours(23, 59, 59, 999))
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      // Tickets del día
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      // Convertir a formato ISO para queries de Supabase
      const todayStartISO = todayStart.toISOString();
      const todayEndISO = todayEnd.toISOString();
      const rangeStartISO = dateRange.start.toISOString();
      const rangeEndISO = dateRange.end.toISOString();

      // Get all tickets
      const { data: allTickets, error: allTicketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (allTicketsError) throw allTicketsError;

      // Get today's tickets
      const { data: todayTicketsData, error: todayTicketsError } = await supabase
        .from('tickets')
        .select('*')
        .gte('created_at', todayStartISO)
        .lte('created_at', todayEndISO);
      
      if (todayTicketsError) throw todayTicketsError;

      // Get pending tickets
      const { data: pendingTicketsData, error: pendingTicketsError } = await supabase
        .from('tickets')
        .select('*')
        .in('status', ['pending', 'processing'])
        .is('delivered_date', null);
      
      if (pendingTicketsError) throw pendingTicketsError;

      // Get tickets in custom date range
      const { data: rangeTicketsData, error: rangeTicketsError } = await supabase
        .from('tickets')
        .select('*')
        .gte('created_at', rangeStartISO)
        .lte('created_at', rangeEndISO);
      
      if (rangeTicketsError) throw rangeTicketsError;

      // Process data
      const todayIncome = calculateTotalIncome(todayTicketsData);
      const totalIncome = calculateTotalIncome(allTickets);
      const rangeIncome = calculateTotalIncome(rangeTicketsData);
      
      // Count services
      const serviceCounts = countServices(allTickets);
      
      // Count dry cleaning items
      const dryCleaningItems = countDryCleaningItems(allTickets);

      return {
        todayTickets: todayTicketsData.length,
        todayIncome,
        pendingTickets: pendingTicketsData.length,
        totalTickets: allTickets.length,
        totalIncome,
        serviceCounts,
        dryCleaningItems,
        ticketsInRange: rangeTicketsData,
        incomeInRange: rangeIncome
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
    todayTickets: data?.todayTickets || 0,
    todayIncome: data?.todayIncome || 0,
    pendingTickets: data?.pendingTickets || 0,
    totalTickets: data?.totalTickets || 0,
    totalIncome: data?.totalIncome || 0,
    serviceCounts: data?.serviceCounts || { valet: 0, lavanderia: 0, tintoreria: 0 },
    dryCleaningItems: data?.dryCleaningItems || {},
    isLoading,
    isError,
    error,
    refetch,
    dateRange,
    setDateRange,
    ticketsInRange: data?.ticketsInRange || [],
    incomeInRange: data?.incomeInRange || 0
  };
};
