
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from '../types';
import { getTicketServices } from './ticketServiceCore';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';
import { subDays } from 'date-fns';
import { handleError } from '../utils/errorHandling';

// Get tickets that are ready for pickup
export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    // Use the dynamic query builder
    const selectColumns = await buildTicketSelectQuery(false);
    
    const { data, error } = await supabase
      .from('tickets')
      .select(selectColumns)
      .eq('status', 'ready')
      .eq('is_canceled', false) // Only show non-canceled tickets
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get customer info for each ticket
    const tickets: Ticket[] = [];
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid or empty data received from tickets query');
      return [];
    }

    for (const ticketData of data) {
      // Skip invalid ticket data
      if (!ticketData || typeof ticketData !== 'object') {
        console.error('Invalid ticket data received:', ticketData);
        continue;
      }
      
      try {
        // Safe property check before accessing
        if (ticketData && typeof ticketData === 'object' && 'customer_id' in ticketData) {
          const customerId = ticketData.customer_id;
          if (!customerId) {
            console.error('Ticket has no customer_id:', 
              'id' in ticketData ? ticketData.id : 'unknown');
            continue;
          }

          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('name, phone')
            .eq('id', customerId)
            .single();
          
          if (customerError) {
            console.error('Error fetching customer for ticket:', customerError);
            continue;
          }

          // Add explicit null checks before mapping
          if (customerData) {
            // Map ticket data to Ticket model with explicit null check
            const ticketModel = mapTicketData(ticketData, customerData, false);
            if (ticketModel) {
              tickets.push(ticketModel);
            }
          }
        }
      } catch (err) {
        console.error('Error processing ticket:', err);
        continue;
      }
    }

    // Get services for each ticket
    for (const ticket of tickets) {
      // Only call getTicketServices if ticket and ticket.id exist
      if (ticket && ticket.id) {
        ticket.services = await getTicketServices(ticket.id);
      }
    }

    return tickets;
  } catch (error) {
    handleError(error, 'getPickupTickets', 'Error fetching pickup tickets');
    return [];
  }
};

// Mark a ticket as delivered
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    // First check if the tickets table has a delivered_date column
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();
    
    const updateData: Record<string, any> = {
      status: 'delivered',
      is_paid: true, // Mark as paid when delivered
      updated_at: new Date().toISOString()
    };
    
    // Only add delivered_date if the column exists
    if (hasDeliveredDateColumn) {
      updateData.delivered_date = new Date().toISOString();
    }

    const { error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId);

    if (error) throw error;

    toast.success('Ticket marcado como entregado y pagado');
    return true;
  } catch (error) {
    handleError(error, 'markTicketAsDelivered', 'Error al marcar el ticket como entregado');
    return false;
  }
};

// Get tickets that haven't been retrieved for a specified number of days
export const getUnretrievedTickets = async (days: number): Promise<Ticket[]> => {
  try {
    // Calculate the cutoff date (current date minus specified days)
    const cutoffDate = subDays(new Date(), days);

    // Use dynamic query builder for select
    const selectColumns = await buildTicketSelectQuery(false);
    
    const { data, error } = await supabase
      .from('tickets')
      .select(selectColumns)
      .eq('status', 'ready') // Only tickets that are ready for pickup
      .eq('is_canceled', false) // Not canceled
      .lte('created_at', cutoffDate.toISOString()) // Created before the cutoff date
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || !Array.isArray(data)) {
      console.error('Invalid or empty data received from unretrieved tickets query');
      return [];
    }

    // Transform data to match the Ticket type with better error handling
    const tickets: Ticket[] = [];
    
    for (const rawTicketData of data) {
      // Skip invalid ticket data with additional safety check
      if (!rawTicketData || typeof rawTicketData !== 'object') {
        console.error('Invalid ticket data received:', rawTicketData);
        continue;
      }
      
      try {
        // Safe property check before accessing
        if (rawTicketData && typeof rawTicketData === 'object' && 'customer_id' in rawTicketData) {
          const customerId = rawTicketData.customer_id;
          if (!customerId) {
            console.error('Ticket has no customer_id:', 
              'id' in rawTicketData ? rawTicketData.id : 'unknown');
            continue;
          }

          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('name, phone')
            .eq('id', customerId)
            .single();
            
          if (customerError) {
            console.error('Error fetching customer for ticket:', customerError);
            continue;
          }
          
          // Only proceed if we have valid ticket and customer data
          if (customerData) {
            // Map the ticket data using our shared utility
            const ticketModel = mapTicketData(rawTicketData, customerData, false);
            if (ticketModel) {
              tickets.push(ticketModel);
            }
          }
        }
      } catch (err) {
        console.error('Error processing unretrieved ticket:', err);
        continue;
      }
    }

    return tickets;
  } catch (error) {
    handleError(error, `getUnretrievedTickets(${days} days)`, `Error al obtener tickets no retirados (${days} días)`);
    return [];
  }
};
