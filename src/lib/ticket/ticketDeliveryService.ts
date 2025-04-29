
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';
import { TICKET_STATUS } from '@/lib/constants/appConstants';

/**
 * Get list of delivered tickets
 */
export const getDeliveredTickets = async (startDate?: Date, endDate?: Date): Promise<Ticket[]> => {
  try {
    // First check if delivered_date column exists
    const hasDeliveredDate = await checkDeliveredDateColumnExists();

    // Build query with proper status filter
    let query = buildTicketSelectQuery()
      .eq('status', TICKET_STATUS.DELIVERED)
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

    // Transform data to match application types
    return data
      .filter(ticket => ticket && typeof ticket === 'object')
      .map(ticket => mapTicketData(ticket))
      .filter((ticket): ticket is Ticket => ticket !== null);
  } catch (error) {
    console.error('Error fetching delivered tickets:', error);
    return [];
  }
};
