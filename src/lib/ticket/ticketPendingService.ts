import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';
import { getDatabaseStatuses } from './ticketStatusService';

/**
 * Get all pending tickets (including ready tickets)
 */
export const getPendingTickets = async (): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();

    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);

    // Get all pending tickets (not delivered) using the status service
    const pendingStatuses = getDatabaseStatuses('PENDING');

    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select(selectQuery)
      .in('status', pendingStatuses)
      .eq('is_canceled', false);

    if (error) {
      console.error('Error retrieving pending tickets:', error);
      throw error;
    }

    // Map to application Ticket model
    const tickets = ticketsData
      .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
      .filter(ticket => ticket !== null) as Ticket[];

    return tickets;
  } catch (error) {
    console.error('Error retrieving pending tickets:', error);
    return [];
  }
};

/**
 * Get tickets with status 'pending' or 'processing' (not including 'ready')
 */
export const getProcessingTickets = async (): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();

    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);

    // Get only tickets in 'pending' or 'processing' status (not 'ready')
    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select(selectQuery)
      .in('status', ['pending', 'processing']) // We still use explicit values here as this is a subset
      .eq('is_canceled', false);

    if (error) {
      console.error('Error retrieving processing tickets:', error);
      throw error;
    }

    // Map to application Ticket model
    const tickets = ticketsData
      .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
      .filter(ticket => ticket !== null) as Ticket[];

    return tickets;
  } catch (error) {
    console.error('Error retrieving processing tickets:', error);
    return [];
  }
};
