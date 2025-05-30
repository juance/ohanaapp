
import { supabase } from '@/integrations/supabase/client';
import { TicketAnalytics } from './interfaces';

export const fetchTicketsInDateRange = async (startDate: Date, endDate: Date) => {
  try {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers(*),
        dry_cleaning_items(*)
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('is_canceled', false);

    if (error) throw error;

    const { data: dryCleaningItems } = await supabase
      .from('dry_cleaning_items')
      .select('*');

    return {
      tickets: tickets || [],
      dryCleaningItems: dryCleaningItems || []
    };
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const calculateTicketAnalytics = async (startDate: Date, endDate: Date): Promise<TicketAnalytics | null> => {
  try {
    const { data, error } = await supabase
      .rpc('calculate_ticket_metrics', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      });

    if (error) throw error;

    if (data) {
      return {
        totalTickets: data.totalTickets || 0,
        averageTicketValue: data.averageTicketValue || 0,
        totalRevenue: data.totalRevenue || 0,
        ticketsByStatus: data.ticketsByStatus || {
          pending: 0,
          processing: 0,
          ready: 0,
          delivered: 0
        },
        topServices: [],
        revenueByMonth: data.revenueByMonth || [],
        itemTypeDistribution: data.itemTypeDistribution || {},
        paymentMethodDistribution: data.paymentMethodDistribution || {},
        freeValets: 0,
        paidTickets: data.totalTickets || 0
      };
    }

    return null;
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return null;
  }
};

export const exportAnalyticsToCSV = async (analytics: TicketAnalytics) => {
  try {
    const csvData = [
      ['Métrica', 'Valor'],
      ['Total de Tickets', analytics.totalTickets.toString()],
      ['Valor Promedio de Ticket', analytics.averageTicketValue.toString()],
      ['Ingresos Totales', analytics.totalRevenue.toString()],
      ['Tickets Pendientes', analytics.ticketsByStatus.pending.toString()],
      ['Tickets Listos', analytics.ticketsByStatus.ready.toString()],
      ['Tickets Entregados', analytics.ticketsByStatus.delivered.toString()]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analytics.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting analytics:', error);
    throw error;
  }
};
