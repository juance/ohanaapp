
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, ClientVisit } from '@/lib/types';
import { toast } from '@/lib/toast';
import { useExpensesData } from './useExpensesData';
import { useClientData } from './useClientData';
import { useChartData } from './useChartData';

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

  // Obtener datos de gastos
  const { expenses, loading: expensesLoading, error: expensesError } = useExpensesData();

  // Obtener datos de clientes
  const { clients, loading: clientsLoading, error: clientsError } = useClientData();

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

  // Generar datos para los gráficos
  const chartData = useChartData('monthly', {
    daily: null,
    weekly: null,
    monthly: {
      salesByWeek: {
        'Semana 1': ticketStats.revenue * 0.25,
        'Semana 2': ticketStats.revenue * 0.25,
        'Semana 3': ticketStats.revenue * 0.25,
        'Semana 4': ticketStats.revenue * 0.25
      },
      dryCleaningItems: {
        'Valet': ticketStats.valetCount,
        'Tintorería': ticketStats.dryCleaningItemsCount
      }
    }
  }, expenses);

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

  // Determinar si está cargando cualquiera de los datos
  const isLoading = loading || expensesLoading || clientsLoading;

  // Combinar errores
  const combinedError = error || expensesError || clientsError;

  return {
    data: {
      metrics: ticketStats,
      expenses: expenses,
      clients: clients,
      chartData: chartData
    },
    isLoading: isLoading,
    error: combinedError,
    refreshData
  };
};
