
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

interface DateRange {
  start: Date;
  end: Date;
}

interface DashboardData {
  ticketsInRange: any[];
  incomeInRange: number;
  serviceCounts: {
    valet: number;
    lavanderia: number;
    tintoreria: number;
  };
  dryCleaningItems: Record<string, number>;
}

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
    end: new Date()
  });
  const [ticketsInRange, setTicketsInRange] = useState<any[]>([]);
  const [incomeInRange, setIncomeInRange] = useState(0);
  const [serviceCounts, setServiceCounts] = useState({
    valet: 0,
    lavanderia: 0,
    tintoreria: 0
  });
  const [dryCleaningItems, setDryCleaningItems] = useState<Record<string, number>>({});

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Obtener tickets en el rango de fechas
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          customers(*),
          dry_cleaning_items(*)
        `)
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString())
        .eq('is_canceled', false);

      if (ticketsError) {
        console.error('Error fetching tickets:', ticketsError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos del dashboard"
        });
        return;
      }

      const ticketData = tickets || [];
      setTicketsInRange(ticketData);

      // Calcular ingresos
      const totalIncome = ticketData.reduce((sum, ticket) => sum + (ticket.total || 0), 0);
      setIncomeInRange(totalIncome);

      // Contar servicios
      const services = {
        valet: ticketData.filter(t => t.valet_quantity > 0).length,
        lavanderia: ticketData.filter(t => !t.valet_quantity || t.valet_quantity === 0).length,
        tintoreria: 0
      };

      // Contar items de tintorería
      const dryItems: Record<string, number> = {};
      ticketData.forEach(ticket => {
        if (ticket.dry_cleaning_items && Array.isArray(ticket.dry_cleaning_items)) {
          services.tintoreria += ticket.dry_cleaning_items.length;
          ticket.dry_cleaning_items.forEach((item: any) => {
            dryItems[item.name] = (dryItems[item.name] || 0) + item.quantity;
          });
        }
      });

      setServiceCounts(services);
      setDryCleaningItems(dryItems);

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los datos del dashboard"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  return {
    isLoading,
    dateRange,
    setDateRange,
    ticketsInRange,
    incomeInRange,
    serviceCounts,
    dryCleaningItems,
    refreshData: fetchDashboardData
  };
};
