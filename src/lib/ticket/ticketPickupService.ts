
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';
import { TICKET_STATUS } from '@/lib/constants/appConstants';
import { differenceInDays } from 'date-fns';
import { toast } from '@/lib/toast';

/**
 * Get tickets ready for pickup from Supabase
 */
export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    console.log('Getting pickup tickets');
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();
    console.log('Has delivered_date column:', hasDeliveredDateColumn);

    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);
    console.log('Select query:', selectQuery);

    // First, check if there are any tickets in the database
    const { count, error: countError } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true });

    console.log('Total tickets in database:', count);

    if (countError) {
      console.error('Error counting tickets:', countError);
      throw countError;
    }

    // If there are no tickets, return empty array
    if (count === 0) {
      console.log('No tickets found in database');
      return [];
    }

    // Get tickets with status 'ready' and not canceled
    console.log('Querying tickets with status:', TICKET_STATUS.READY);

    // Log the actual query we're about to execute
    console.log('Query parameters:', {
      table: 'tickets',
      select: selectQuery,
      filters: {
        status: TICKET_STATUS.READY,
        is_canceled: false
      }
    });

    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select(selectQuery)
      .eq('status', TICKET_STATUS.READY)
      .eq('is_canceled', false);

    console.log('Query result:', ticketsData ? `Found ${ticketsData.length} tickets` : 'No tickets found');
    
    if (ticketsData) {
      console.log('Ticket statuses:', ticketsData.map(t => t.status).join(', '));
    }

    // If no tickets found, let's do a broader query to see if there are any tickets at all
    if (!ticketsData || ticketsData.length === 0) {
      console.log('No ready tickets found, checking for any tickets...');

      const { data: allTickets, error: allTicketsError } = await supabase
        .from('tickets')
        .select('id, ticket_number, status, is_canceled')
        .limit(10);

      if (allTicketsError) {
        console.error('Error querying all tickets:', allTicketsError);
      } else {
        console.log('All tickets sample:', allTickets);
        if (allTickets && allTickets.length > 0) {
          console.log('Statuses of all tickets:', allTickets.map(t => t.status).join(', '));
          console.log('Canceled tickets:', allTickets.filter(t => t.is_canceled).length);
        }
      }
    }

    if (error) {
      console.error('Error querying tickets:', error);
      throw error;
    }

    if (!ticketsData || !Array.isArray(ticketsData) || ticketsData.length === 0) {
      console.log('No ready tickets found');
      return [];
    }

    // Map to application Ticket model
    console.log('Mapping ticket data');
    const tickets = ticketsData
      .map(ticket => {
        console.log('Raw ticket data:', JSON.stringify(ticket, null, 2));
        const mappedTicket = mapTicketData(ticket, hasDeliveredDateColumn);
        if (!mappedTicket) {
          console.error('Failed to map ticket:', ticket.id);
        }
        return mappedTicket;
      })
      .filter(ticket => ticket !== null) as Ticket[];

    console.log('Mapped tickets count:', tickets.length);
    console.log('Mapped tickets:', JSON.stringify(tickets.map(t => ({
      id: t.id,
      status: t.status,
      clientName: t.clientName
    })), null, 2));

    return tickets;
  } catch (error) {
    console.error('Error retrieving pickup tickets:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
};

/**
 * Mark a ticket as delivered and paid
 */
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    console.log('Marking ticket as delivered:', ticketId);
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('tickets')
      .update({
        status: TICKET_STATUS.DELIVERED,
        is_paid: true,
        updated_at: now,
        delivered_date: now
      })
      .eq('id', ticketId);

    if (error) {
      console.error('Error marking ticket as delivered:', error);
      throw error;
    }

    console.log('Ticket marked as delivered successfully');
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
      .eq('status', TICKET_STATUS.READY)
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

/**
 * Cancel a ticket
 */
export const cancelTicket = async (ticketId: string, reason: string): Promise<boolean> => {
  try {
    console.log('Canceling ticket:', ticketId, 'Reason:', reason);
    const { error } = await supabase
      .from('tickets')
      .update({
        is_canceled: true,
        cancel_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) {
      console.error('Error canceling ticket:', error);
      throw error;
    }

    console.log('Ticket canceled successfully');
    toast.success('Ticket anulado correctamente');
    return true;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    toast.error('Error al anular el ticket');
    return false;
  }
};
