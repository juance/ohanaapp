
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

      const fetchPromises: Promise<any>[] = [];

      // Fetch all tickets
      const { data, error: ticketsError } = await supabase
        .from('tickets')
        .select('*');

      if (ticketsError) throw ticketsError;

      // Initialize statistics
      let total = data.length;
      let delivered = 0;
      let pending = 0;
      let revenue = 0;
      let valetCount = 0;

      // Process each ticket to calculate the statistics
      const processedTickets = data.map(ticket => {
        revenue += ticket.total || 0;

        if (ticket.status === 'delivered') {
          delivered++;
        } else {
          pending++;
        }

        valetCount += ticket.valet_quantity || 0;

        // Safely handle the dry cleaning items
        let dryCleaningItemsCount = 0;

        // Fetch dry cleaning items separately since they might not be included in the join
        const getDryCleaningItems = async (ticketId: string) => {
          const { data: items } = await supabase
            .from('dry_cleaning_items')
            .select('*')
            .eq('ticket_id', ticketId);

          return items || [];
        };

        // Track async calls to fetch dry cleaning items
        fetchPromises.push(
          getDryCleaningItems(ticket.id).then(items => {
            dryCleaningItemsCount = items.length;
          })
        );

        return {
          id: ticket.id,
          total: ticket.total,
          status: ticket.status,
          valet_quantity: ticket.valet_quantity,
          dryCleaningItemsCount, // This will be updated after the promise resolves
        };
      });

      // Wait for all dry cleaning items to be fetched
      await Promise.all(fetchPromises);

      // Sum up the dry cleaning items count
      const totalDryCleaningItemsCount = processedTickets.reduce((sum, ticket) => sum + ticket.dryCleaningItemsCount, 0);

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
