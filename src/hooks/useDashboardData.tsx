
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { toast } from '@/lib/toast';

interface TicketStats {
  total: number;
  delivered: number;
  pending: number;
  revenue: number;
  valetCount: number;
  dryCleaningItemsCount: number;
}

export const useDashboardData = () => {
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    total: 0,
    delivered: 0,
    pending: 0,
    revenue: 0,
    valetCount: 0,
    dryCleaningItemsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch ticket details from Supabase
  const fetchTicketDetails = async (): Promise<TicketStats> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard data...');

      // Fetch all tickets with a simpler query
      const { data, error: ticketsError } = await supabase
        .from('tickets')
        .select('id, total, status, valet_quantity, created_at');

      if (ticketsError) {
        console.error('Error fetching tickets:', ticketsError);
        throw ticketsError;
      }

      console.log(`Fetched ${data?.length || 0} tickets`);

      // Initialize statistics
      let total = data?.length || 0;
      let delivered = 0;
      let pending = 0;
      let revenue = 0;
      let valetCount = 0;

      // Process each ticket to calculate the statistics
      if (data && data.length > 0) {
        data.forEach(ticket => {
          revenue += ticket.total || 0;

          if (ticket.status === 'delivered') {
            delivered++;
          } else {
            pending++;
          }

          valetCount += ticket.valet_quantity || 0;
        });
      }

      console.log('Basic stats calculated:', { total, delivered, pending, revenue, valetCount });

      // Fetch dry cleaning items count with a single query
      const { data: dryCleaningData, error: dryCleaningError } = await supabase
        .from('dry_cleaning_items')
        .select('id');

      if (dryCleaningError) {
        console.error('Error fetching dry cleaning items:', dryCleaningError);
        throw dryCleaningError;
      }

      const totalDryCleaningItemsCount = dryCleaningData?.length || 0;
      console.log(`Fetched ${totalDryCleaningItemsCount} dry cleaning items`);

      return {
        total,
        delivered,
        pending,
        revenue,
        valetCount,
        dryCleaningItemsCount: totalDryCleaningItemsCount,
      };
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Error fetching ticket details'));
      return {
        total: 0,
        delivered: 0,
        pending: 0,
        revenue: 0,
        valetCount: 0,
        dryCleaningItemsCount: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar los datos
  const refreshData = useCallback(async () => {
    try {
      const stats = await fetchTicketDetails();
      setTicketStats(stats);
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error refreshing data'));
      toast.error('Error al actualizar los datos del dashboard');
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshData().catch(err => console.error('Error in initial data load:', err));
  }, [refreshData]);

  return {
    data: {
      metrics: ticketStats,
      expenses: {
        daily: 0,
        weekly: 0,
        monthly: 0
      },
      clients: [],
      chartData: {
        barData: [],
        lineData: [],
        pieData: []
      }
    },
    isLoading: loading,
    error,
    refreshData
  };
};
