
import { Ticket } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';

/**
 * Get all tickets with pending status
 * @returns A list of tickets with pending status
 */
export async function getPendingTickets(): Promise<Ticket[]> {
  try {
    // Build the query for pending tickets
    const query = buildTicketSelectQuery();
    
    // Execute the query with pending status
    const { data: pendingTickets, error } = await query
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending tickets:', error);
      throw error;
    }

    return pendingTickets.map(mapTicketData);
  } catch (error) {
    console.error('Error in getPendingTickets:', error);
    return [];
  }
}

/**
 * Get all tickets with ready status
 * @returns A list of tickets with ready status
 */
export async function getReadyTickets(): Promise<Ticket[]> {
  try {
    // Build the query for ready tickets
    const query = buildTicketSelectQuery();
    
    // Execute the query with ready status
    const { data: readyTickets, error } = await query
      .eq('status', 'ready')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ready tickets:', error);
      throw error;
    }

    return readyTickets.map(mapTicketData);
  } catch (error) {
    console.error('Error in getReadyTickets:', error);
    return [];
  }
}
