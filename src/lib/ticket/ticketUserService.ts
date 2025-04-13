
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';
import { TICKET_STATUS } from '@/lib/constants/appConstants';
import { isDelivered, isPending, getDatabaseStatuses } from './ticketStatusService';

/**
 * Get tickets for a specific phone number
 */
export const getTicketsByPhoneNumber = async (phoneNumber: string): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();

    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);

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

    // Get tickets for this customer, both ready/pending and delivered
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('tickets')
      .select(selectQuery)
      .eq('customer_id', customer.id)
      .eq('is_canceled', false)
      .order('created_at', { ascending: false });

    if (ticketsError) {
      console.error('Error retrieving customer tickets:', ticketsError);
      return [];
    }

    // Map to application Ticket model
    const tickets = ticketsData
      .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
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
