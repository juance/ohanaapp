
import { supabase } from '@/integrations/supabase/client';
import { Ticket, DryCleaningItem } from '@/lib/types';
import { formatTicketData } from '../utils/ticketFormatters';

/**
 * Service for fetching ticket data from the database
 */
export const fetchTicketData = async (ticketId: string): Promise<Ticket | null> => {
  try {
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('*, customers(name, phone)')
      .eq('id', ticketId)
      .single();
    
    if (ticketError) throw ticketError;

    // Get dry cleaning items
    const { data: dryCleaningItems, error: itemsError } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);
    
    if (itemsError) throw itemsError;

    return formatTicketData(ticketData, dryCleaningItems || []);
  } catch (error) {
    console.error("Error fetching ticket data:", error);
    return null;
  }
};

/**
 * Finds a ticket in a provided array or fetches it from the database if not found
 */
export const getTicket = async (
  ticketId: string, 
  tickets?: Ticket[]
): Promise<Ticket | null> => {
  // If tickets array is provided, try to find the ticket in it first
  if (tickets && tickets.length > 0) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) return ticket;
  }

  // If not found in array or array not provided, fetch from database
  return await fetchTicketData(ticketId);
};
