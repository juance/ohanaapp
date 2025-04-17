
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Ticket } from '@/lib/types';

export const useDashboardData = () => {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const formatDateForDisplay = (date: Date): string => {
    return format(date, 'dd/MM/yyyy');
  };

  const formatDateForAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const start = useMemo(() => startOfDay(startDate), [startDate]);
  const end = useMemo(() => endOfDay(endDate), [endDate]);

  // Fetch delivered tickets
  const fetchDeliveredTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', 'delivered')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching delivered tickets:', error);
      throw error;
    }

    return data || [];
  };

  // Fetch pending tickets
  const fetchPendingTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .in('status', ['pending', 'processing', 'ready'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending tickets:', error);
      throw error;
    }

    return data || [];
  };

  // Calculate revenue in the given date range
  const calculateRevenue = (startDate: Date, endDate: Date) => {
    return (deliveredTicketsData as any[]).reduce((total, ticket) => {
      const ticketDate = new Date(ticket.created_at);
      if (ticketDate >= startDate && ticketDate <= endDate && ticket.is_paid) {
        return total + Number(ticket.total);
      }
      return total;
    }, 0);
  };

  // Calculate tickets with dry cleaning
  const calculateDryCleaningTickets = () => {
    return (deliveredTicketsData as any[]).filter(ticket => {
      return (ticket as any).dry_cleaning_items && (ticket as any).dry_cleaning_items.length > 0;
    }).length;
  };

  const {
    data: deliveredTicketsData = [],
    isLoading: isLoadingDelivered,
    error: errorDelivered,
    refetch: refetchDelivered,
  } = useQuery({
    queryKey: ['deliveredTickets'],
    queryFn: fetchDeliveredTickets
  });

  const {
    data: pendingTicketsData = [],
    isLoading: isLoadingPending,
    error: errorPending,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ['pendingTickets'],
    queryFn: fetchPendingTickets
  });

  const totalRevenue = useMemo(() => {
    return calculateRevenue(start, end);
  }, [start, end, deliveredTicketsData]);

  const totalDeliveredTickets = useMemo(() => {
    return (deliveredTicketsData as any[]).length;
  }, [deliveredTicketsData]);

  const totalPendingTickets = useMemo(() => {
    return (pendingTicketsData as any[]).length;
  }, [pendingTicketsData]);

  const dryCleaningTickets = useMemo(() => {
    return calculateDryCleaningTickets();
  }, [deliveredTicketsData]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    formatDateForDisplay,
    formatDateForAPI,
    totalRevenue,
    totalDeliveredTickets,
    totalPendingTickets,
    dryCleaningTickets,
    isLoadingDelivered,
    errorDelivered,
    refetchDelivered,
    isLoadingPending,
    errorPending,
    refetchPending,
  };
};
