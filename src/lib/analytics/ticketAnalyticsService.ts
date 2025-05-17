
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';
import { TicketAnalytics } from './interfaces';

/**
 * Fetch tickets and their details within a date range
 */
export const fetchTicketsInDateRange = async (startDate: Date, endDate: Date) => {
  console.log('Fetching tickets from', startDate.toISOString(), 'to', endDate.toISOString());
  
  try {
    // Get tickets within the specified date range
    const { data: tickets = [], error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (id, name, phone, valets_count, free_valets)
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });
      
    if (ticketsError) {
      console.error('Error fetching tickets:', ticketsError);
      throw ticketsError;
    }
    
    // Get dry cleaning items for these tickets
    const ticketIds = tickets.map(t => t.id);
    
    const { data: dryCleaningItems = [], error: itemsError } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .in('ticket_id', ticketIds);
      
    if (itemsError) {
      console.error('Error fetching dry cleaning items:', itemsError);
      throw itemsError;
    }
    
    return { tickets, dryCleaningItems };
  } catch (error) {
    console.error('Error in fetchTicketsInDateRange:', error);
    return { tickets: [], dryCleaningItems: [] };
  }
};

/**
 * Export analytics data to CSV format
 */
export const exportAnalyticsToCSV = async (analytics: TicketAnalytics): Promise<void> => {
  try {
    // Convert analytics data to CSV format
    const headers = [
      'Total Tickets',
      'Average Ticket Value',
      'Total Revenue',
      'Tickets Ready',
      'Top Payment Method',
      'Top Item Type',
    ];
    
    // Get top payment method
    let topPaymentMethod = '';
    let maxCount = 0;
    
    for (const [method, count] of Object.entries(analytics.paymentMethodDistribution)) {
      if (count > maxCount) {
        maxCount = count;
        topPaymentMethod = method;
      }
    }
    
    // Get top item type
    let topItemType = '';
    maxCount = 0;
    
    for (const [type, count] of Object.entries(analytics.itemTypeDistribution)) {
      if (count > maxCount) {
        maxCount = count;
        topItemType = type;
      }
    }
    
    const values = [
      analytics.totalTickets.toString(),
      `$${analytics.averageTicketValue.toFixed(2)}`,
      `$${analytics.totalRevenue.toFixed(2)}`,
      analytics.ticketsByStatus?.ready?.toString() || '0',
      topPaymentMethod,
      topItemType,
    ];
    
    // Create CSV content
    let csv = headers.join(',') + '\n';
    csv += values.join(',');
    
    // Create and download the CSV file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting analytics to CSV:', error);
    throw error;
  }
};

/**
 * Calculate ticket analytics using Supabase server function
 */
export const calculateTicketAnalytics = async (startDate: Date, endDate: Date): Promise<TicketAnalytics | null> => {
  try {
    // Use the server-side function to calculate metrics
    const { data, error } = await supabase.rpc(
      'calculate_ticket_metrics',
      { start_date: startDate.toISOString(), end_date: endDate.toISOString() }
    );

    if (error) {
      console.error('Error calculating ticket analytics:', error);
      throw error;
    }

    // Parse and type-cast the response properly
    if (data) {
      // Cast to unknown first, then to TicketAnalytics
      return data as unknown as TicketAnalytics;
    }

    return null;
  } catch (error) {
    console.error('Error in calculateTicketAnalytics:', error);
    return null;
  }
};
