
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches ticket data within a specified date range
 */
export const fetchTicketsInDateRange = async (from: Date, to: Date) => {
  try {
    console.log('Fetching ticket analytics data for date range:', {
      from: from.toISOString(),
      to: to.toISOString()
    });

    // Get tickets within date range from Supabase
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        id,
        total,
        payment_method,
        status,
        date,
        created_at,
        is_canceled,
        is_paid,
        valet_quantity,
        customer_id
      `)
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString())
      .eq('is_canceled', false);

    if (ticketsError) throw ticketsError;

    console.log(`Fetched ${tickets?.length || 0} tickets`);
    
    // If no tickets, return empty array
    if (!tickets || tickets.length === 0) {
      console.log('No tickets found in date range');
      return { tickets: [], dryCleaningItems: [] };
    }
    
    // Get dry cleaning items for these tickets
    const ticketIds = tickets.map(ticket => ticket.id);
    const { data: dryCleaningItems, error: itemsError } = await supabase
      .from('dry_cleaning_items')
      .select('id, name, quantity, price, ticket_id')
      .in('ticket_id', ticketIds);

    if (itemsError) {
      console.error('Error fetching dry cleaning items:', itemsError);
      return { tickets, dryCleaningItems: [] };
    }

    console.log(`Fetched ${dryCleaningItems?.length || 0} dry cleaning items`);
    return { tickets, dryCleaningItems: dryCleaningItems || [] };
  } catch (err) {
    console.error("Error fetching ticket analytics data:", err);
    throw err;
  }
};

/**
 * Exports analytics data to CSV
 */
export const exportAnalyticsToCSV = (data: any) => {
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
      ...data.revenueByMonth.map(({ month, revenue }: { month: string, revenue: number }) => [month, revenue])
    ];

    const csvString = csvContent.map(row => row.join(',')).join('\n');

    // Create a download link
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
