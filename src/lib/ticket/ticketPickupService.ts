
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';

/**
 * Get list of tickets ready for pickup
 */
export const getPickupTickets = async (startDate?: Date, endDate?: Date): Promise<Ticket[]> => {
  try {
    // First check if delivered_date column exists
    const hasDeliveredDate = await checkDeliveredDateColumnExists();
    
    let query = supabase.from('tickets')
      .select(buildTicketSelectQuery(hasDeliveredDate))
      .eq('status', 'ready')
      .is('is_canceled', false)
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
    console.error('Error fetching pickup tickets:', error);
    return [];
  }
};

/**
 * Mark a ticket as delivered
 */
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    // First check if delivered_date column exists
    const hasDeliveredDate = await checkDeliveredDateColumnExists();
    
    // Prepare update data
    const updateData: any = {
      status: 'delivered',
      updated_at: new Date().toISOString()
    };
    
    // If the delivered_date column exists, set it
    if (hasDeliveredDate) {
      updateData.delivered_date = new Date().toISOString();
    }
    
    // Update the ticket
    const { error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId);
    
    if (error) throw error;
    
    toast.success('Ticket marcado como entregado');
    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    toast.error('Error al marcar el ticket como entregado');
    return false;
  }
};

/**
 * Get list of unretrieved tickets (tickets that have been ready for pickup for more than X days)
 */
export const getUnretrievedTickets = async (daysThreshold: number = 7): Promise<Ticket[]> => {
  try {
    // Calculate the threshold date
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    
    // First check if delivered_date column exists
    const hasDeliveredDate = await checkDeliveredDateColumnExists();
    
    // Get tickets that have been ready for more than the threshold days
    const { data, error } = await supabase.from('tickets')
      .select(buildTicketSelectQuery(hasDeliveredDate))
      .eq('status', 'ready')
      .is('is_canceled', false)
      .lte('updated_at', thresholdDate.toISOString())
      .order('updated_at', { ascending: false });
    
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
    console.error('Error fetching unretrieved tickets:', error);
    return [];
  }
};
