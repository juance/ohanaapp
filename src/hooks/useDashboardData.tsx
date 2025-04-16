
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useExpensesData } from './useExpensesData';
import { useClientData } from './useClientData';
import { useChartData } from './useChartData';
import { ClientVisit } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface UseDashboardDataReturn {
  isLoading: boolean;
  error: Error | null;
  data: {
    metrics: any;
    expenses: any;
    clients: ClientVisit[];
    chartData: {
      barData: any[];
      lineData: any[];
      pieData: any[];
    };
  };
  refreshData: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [error, setError] = useState<Error | null>(null);
  const [metricsData, setMetricsData] = useState<any>({
    daily: null,
    weekly: null,
    monthly: {
      totalTickets: 0,
      paidTickets: 0, // Reset to zero
      totalRevenue: 0,
      salesByWeek: {
        'Week 1': 0,
        'Week 2': 0,
        'Week 3': 0,
        'Week 4': 0
      },
      dryCleaningItems: {}
    }
  });
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);

  // Use our separated hooks
  const expensesData = useExpensesData();
  const clientData = useClientData();

  // Calculate chart data based on metrics data and the current period
  const period = 'monthly'; // Default to monthly
  const chartData = useChartData(
    period,
    {
      daily: metricsData.daily || null,
      weekly: metricsData.weekly || null,
      monthly: metricsData.monthly || null
    },
    {
      daily: Number(expensesData.expenses?.daily || 0),
      weekly: Number(expensesData.expenses?.weekly || 0),
      monthly: Number(expensesData.expenses?.monthly || 0)
    }
  );

  // Fetch real metrics data from Supabase
  const refreshMetricsData = async () => {
    setIsMetricsLoading(true);
    try {
      // Fetch tickets data from Supabase
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*');

      if (ticketsError) throw ticketsError;

      // Calculate metrics
      const totalTickets = tickets?.length || 0;
      const paidTickets = tickets?.filter(ticket => ticket.is_paid).length || 0;
      const totalRevenue = tickets?.reduce((sum, ticket) => sum + (parseFloat(ticket.total) || 0), 0) || 0;

      // Group sales by week
      const salesByWeek = {
        'Week 1': 0,
        'Week 2': 0,
        'Week 3': 0,
        'Week 4': 0
      };

      // Group dry cleaning items
      const dryCleaningItems: Record<string, number> = {};

      // Process tickets to calculate metrics
      tickets?.forEach(ticket => {
        // Calculate sales by week
        const date = new Date(ticket.created_at);
        const day = date.getDate();
        const week = Math.ceil(day / 7);
        salesByWeek[`Week ${week}`] = (salesByWeek[`Week ${week}`] || 0) + (parseFloat(ticket.total) || 0);

        // Count dry cleaning items
        if (ticket.dry_cleaning_items && Array.isArray(ticket.dry_cleaning_items)) {
          ticket.dry_cleaning_items.forEach((item: any) => {
            dryCleaningItems[item.name] = (dryCleaningItems[item.name] || 0) + (item.quantity || 1);
          });
        }
      });

      // Create metrics object
      const calculatedMetrics = {
        daily: null,
        weekly: null,
        monthly: {
          totalTickets,
          paidTickets,
          totalRevenue,
          salesByWeek,
          dryCleaningItems
        }
      };

      setMetricsData(calculatedMetrics);
    } catch (err) {
      console.error("Error fetching metrics data:", err);
      setError(err instanceof Error ? err : new Error('Error fetching metrics data'));
    } finally {
      setIsMetricsLoading(false);
    }
  };

  // Determine overall loading state
  const isLoading = isMetricsLoading || expensesData.loading || clientData.loading;

  // Function to refresh all data
  const refreshData = async () => {
    try {
      toast.info("Actualizando datos del panel...");

      await Promise.all([
        refreshMetricsData(),
        expensesData.refreshData(),
        clientData.refreshData()
      ]);

      toast.success("Datos del panel actualizados correctamente");
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error refreshing data'));
      toast.error("Error al actualizar los datos del panel");
    }
  };

  // Initial load of data
  useEffect(() => {
    refreshData();
  }, []);

  // Combine data for component consumption
  const combinedData = {
    metrics: metricsData || {},
    expenses: expensesData.expenses || { daily: 0, weekly: 0, monthly: 0 },
    clients: clientData.frequentClients || [],
    chartData: chartData || { barData: [], lineData: [], pieData: [] }
  };

  return {
    isLoading,
    error: error || expensesData.error || clientData.error,
    data: combinedData,
    refreshData
  };
};
