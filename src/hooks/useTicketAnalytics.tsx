import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TicketAnalytics {
  totalTickets: number;
  averageTicketValue: number;
  totalRevenue: number;
  ticketsByStatus?: {
    pending: number;
    processing: number;
    ready: number;
    delivered: number;
  };
  topServices: Array<{ name: string; count: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  itemTypeDistribution: Record<string, number>;
  paymentMethodDistribution: Record<string, number>;
  freeValets?: number;
  paidTickets?: number;
}

export interface UseTicketAnalyticsReturn {
  data: TicketAnalytics;
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  isLoading: boolean;
  error: Error | null;
  exportData: () => Promise<void>;
}

export const useTicketAnalytics = (): UseTicketAnalyticsReturn => {
  const [isLoading, setIsLoading] = useState(false);
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
  
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          id, 
          total, 
          payment_method, 
          status, 
          date,
          is_canceled,
          is_paid,
          valet_quantity,
          dry_cleaning_items (id, name, quantity, price)
        `)
        .gte('date', dateRange.from.toISOString())
        .lte('date', dateRange.to.toISOString())
        .eq('is_canceled', false);

      if (ticketsError) throw ticketsError;

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
        return;
      }

      const totalTickets = tickets.length;
      const totalRevenue = tickets.reduce((sum, ticket) => sum + (Number(ticket.total) || 0), 0);
      const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

      const freeValets = tickets.filter(ticket => ticket.valet_quantity > 0 && ticket.total === 0).length;
      
      const paidTickets = tickets.filter(ticket => ticket.is_paid).length;

      const ticketsByStatus = {
        pending: 0,
        processing: 0,
        ready: 0,
        delivered: 0
      };

      tickets.forEach(ticket => {
        const status = ticket.status as keyof typeof ticketsByStatus;
        if (status in ticketsByStatus) {
          ticketsByStatus[status]++;
        }
      });

      const paymentMethodDistribution: Record<string, number> = {};
      tickets.forEach(ticket => {
        const method = ticket.payment_method;
        paymentMethodDistribution[method] = (paymentMethodDistribution[method] || 0) + 1;
      });

      const itemTypeDistribution: Record<string, number> = {};
      tickets.forEach(ticket => {
        if (ticket.dry_cleaning_items && Array.isArray(ticket.dry_cleaning_items)) {
          ticket.dry_cleaning_items.forEach((item: any) => {
            const itemName = item.name;
            itemTypeDistribution[itemName] = (itemTypeDistribution[itemName] || 0) + (item.quantity || 1);
          });
        }
      });

      const servicesMap = new Map<string, number>();
      tickets.forEach(ticket => {
        if (ticket.dry_cleaning_items && Array.isArray(ticket.dry_cleaning_items)) {
          ticket.dry_cleaning_items.forEach((item: any) => {
            servicesMap.set(item.name, (servicesMap.get(item.name) || 0) + (item.quantity || 1));
          });
        } else {
          servicesMap.set('Valet', (servicesMap.get('Valet') || 0) + 1);
        }
      });

      const topServices = Array.from(servicesMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const revenueByMonthMap = new Map<string, number>();
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      tickets.forEach(ticket => {
        if (!ticket.date) return;
        const date = new Date(ticket.date);
        const monthKey = months[date.getMonth()];
        revenueByMonthMap.set(monthKey, (revenueByMonthMap.get(monthKey) || 0) + Number(ticket.total || 0));
      });

      const revenueByMonth = Array.from(revenueByMonthMap.entries())
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => {
          const aIndex = months.indexOf(a.month);
          const bIndex = months.indexOf(b.month);
          return aIndex - bIndex;
        });

      setData({
        totalTickets,
        averageTicketValue,
        totalRevenue,
        ticketsByStatus,
        topServices,
        revenueByMonth,
        itemTypeDistribution,
        paymentMethodDistribution,
        freeValets, 
        paidTickets 
      });
    } catch (err) {
      console.error("Error fetching ticket analytics:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching analytics'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const exportData = async () => {
    try {
      const csvContent = [
        ['Métrica', 'Valor'],
        ['Total de Tickets', data.totalTickets],
        ['Valor Promedio', data.averageTicketValue],
        ['Ingresos Totales', data.totalRevenue],
        ['Tickets Pendientes', data.ticketsByStatus?.pending || 0],
        ['Tickets en Proceso', data.ticketsByStatus?.processing || 0],
        ['Tickets Listos', data.ticketsByStatus?.ready || 0],
        ['Tickets Entregados', data.ticketsByStatus?.delivered || 0],
        [''],
        ['Distribución por Método de Pago'],
        ...Object.entries(data.paymentMethodDistribution).map(([method, count]) => [method, count]),
        [''],
        ['Distribución por Tipo de Artículo'],
        ...Object.entries(data.itemTypeDistribution).map(([type, count]) => [type, count]),
        [''],
        ['Ingresos por Mes'],
        ...data.revenueByMonth.map(({ month, revenue }) => [month, revenue])
      ];

      const csvString = csvContent.map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ticket_analytics_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error exporting data:', error);
      return Promise.reject(error);
    }
  };

  return {
    data,
    dateRange,
    setDateRange,
    isLoading,
    error,
    exportData
  };
};
