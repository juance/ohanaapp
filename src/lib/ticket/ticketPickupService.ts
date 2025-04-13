
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';
import { TICKET_STATUS } from '@/lib/constants/appConstants';
import { differenceInDays } from 'date-fns';

/**
 * Get tickets ready for pickup from Supabase
 */
export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();

    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);

    // Get tickets with status 'ready' and not canceled
    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select(selectQuery)
      .eq('status', TICKET_STATUS.READY) // Use constant for consistency
      .eq('is_canceled', false);

    if (error) throw error;

    // Map to application Ticket model
    const tickets = ticketsData
      .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
      .filter(ticket => ticket !== null) as Ticket[];

    return tickets;
  } catch (error) {
    console.error('Error retrieving pickup tickets:', error);
    return [];
  }
};

/**
 * Mark a ticket as delivered and paid
 */
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('tickets')
      .update({
        status: TICKET_STATUS.DELIVERED, // Use constant for consistency
        is_paid: true,
        updated_at: now,
        delivered_date: now
      })
      .eq('id', ticketId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    return false;
  }
};

/**
 * Get unretrieved tickets that have been ready for X days
 */
export const getUnretrievedTickets = async (daysThreshold: number): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();

    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);

    // Get all ready tickets that aren't canceled
    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select(selectQuery)
      .eq('status', TICKET_STATUS.READY) // Use constant for consistency
      .eq('is_canceled', false);

    if (error) throw error;

    // Map to application Ticket model
    const allReadyTickets = ticketsData
      .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
      .filter(ticket => ticket !== null) as Ticket[];

    // Filter tickets by age (created more than daysThreshold days ago)
    const now = new Date();
    const oldTickets = allReadyTickets.filter(ticket => {
      const createdDate = new Date(ticket.createdAt);
      const daysDifference = differenceInDays(now, createdDate);
      return daysDifference >= daysThreshold;
    });

    return oldTickets;
  } catch (error) {
    console.error(`Error retrieving unretrieved tickets (${daysThreshold} days):`, error);
    return [];
  }
};
