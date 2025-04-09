
import { supabase } from '@/integrations/supabase/client';
import { Ticket, DryCleaningItem } from './types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticket/ticketQueryUtils';

/**
 * Get tickets marked as delivered from Supabase
 */
export const getDeliveredTickets = async (): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();
    
    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);
    
    // Get delivered tickets from Supabase
    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select(selectQuery)
      .eq('status', 'delivered')
      .eq('is_canceled', false);
    
    if (error) throw error;
    
    // Map to application Ticket model
    const tickets = ticketsData
      .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
      .filter(ticket => ticket !== null) as Ticket[];
    
    return tickets;
  } catch (error) {
    console.error('Error retrieving delivered tickets:', error);
    return [];
  }
};

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
      .eq('status', 'ready')
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
 * Get services associated with a ticket
 */
export const getTicketServices = async (ticketId: string): Promise<DryCleaningItem[]> => {
  try {
    const { data, error } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);
    
    if (error) throw error;
    
    return data as DryCleaningItem[];
  } catch (error) {
    console.error('Error retrieving ticket services:', error);
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
        status: 'delivered',
        is_paid: true,
        updated_at: now,
        // Only set delivered_date if the column exists (handled by RLS)
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
 * Cancel a ticket with a reason
 */
export const cancelTicket = async (ticketId: string, reason: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        is_canceled: true,
        cancel_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    return false;
  }
};
