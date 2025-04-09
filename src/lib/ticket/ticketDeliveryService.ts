
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';

/**
 * Get list of delivered tickets
 */
export const getDeliveredTickets = async (startDate?: Date, endDate?: Date): Promise<Ticket[]> => {
  try {
    // First check if delivered_date column exists
    const hasDeliveredDate = await checkDeliveredDateColumnExists();
    
    let query = supabase.from('tickets')
      .select(buildTicketSelectQuery(hasDeliveredDate))
      .eq('status', 'delivered')
      .order('updated_at', { ascending: false });
    
    // Add date filters if provided
    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Transform data to match our application types
    return data.map((ticket: any) => {
      // Type guard to ensure we're working with valid data
      if (!ticket || typeof ticket !== 'object') {
        return null;
      }
      
      const customerId = ticket.customer_id || null;
      const customerData = ticket.customers || null;
      
      if (customerId && customerData && typeof customerData === 'object') {
        return mapTicketData(ticket, hasDeliveredDate);
      }
      
      return null;
    }).filter((ticket): ticket is Ticket => ticket !== null);
  } catch (error) {
    console.error('Error fetching delivered tickets:', error);
    return [];
  }
};
