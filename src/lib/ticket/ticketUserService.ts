
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';
import { isDelivered, isPending } from './ticketStatusService';

/**
 * Get tickets for a specific phone number
 */
export const getTicketsByPhoneNumber = async (phoneNumber: string): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();

    // First get the customer ID for the phone number
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phoneNumber)
      .single();

    if (customerError || !customer) {
      console.error('Error finding customer by phone number:', customerError);
      return [];
    }

    // Build the query
    const query = buildTicketSelectQuery();
    
    // Execute the query with customer_id and not canceled
    const { data: ticketsData, error: ticketsError } = await query
      .eq('customer_id', customer.id)
      .eq('is_canceled', false)
      .order('created_at', { ascending: false });

    if (ticketsError) {
      console.error('Error retrieving customer tickets:', ticketsError);
      return [];
    }

    // Map to application Ticket model
    const tickets = ticketsData
      .map(ticket => mapTicketData(ticket))
      .filter(ticket => ticket !== null) as Ticket[];

    return tickets;
  } catch (error) {
    console.error('Error retrieving customer tickets:', error);
    return [];
  }
};

/**
 * Get delivered tickets for a specific phone number
 */
export const getDeliveredTicketsByPhoneNumber = async (phoneNumber: string): Promise<Ticket[]> => {
  const allTickets = await getTicketsByPhoneNumber(phoneNumber);
  return allTickets.filter(ticket => isDelivered(ticket.status));
};

/**
 * Get pending/ready tickets for a specific phone number
 */
export const getPendingTicketsByPhoneNumber = async (phoneNumber: string): Promise<Ticket[]> => {
  const allTickets = await getTicketsByPhoneNumber(phoneNumber);
  return allTickets.filter(ticket => isPending(ticket.status));
};
