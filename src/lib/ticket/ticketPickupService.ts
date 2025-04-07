
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from '../types';
import { getTicketServices } from './ticketServiceCore';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';
import { subDays } from 'date-fns';

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
    
    if (data && Array.isArray(data)) {
      for (const ticketData of data) {
        // Skip invalid ticket data
        if (!ticketData || typeof ticketData !== 'object' || !ticketData.id) {
          console.error('Invalid ticket data received:', ticketData);
          continue;
        }
        
        try {
          // Get customer details
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('name, phone')
            .eq('id', ticketData.customer_id)
            .single();
          
          if (customerError) {
            console.error('Error fetching customer for ticket:', customerError);
            continue;
          }

          // Map ticket data to Ticket model
          const ticketModel = mapTicketData(ticketData, customerData, false);
          if (ticketModel) {
            tickets.push(ticketModel);
          }
        } catch (err) {
          console.error('Error processing ticket:', err);
          continue;
        }
      }

      // Get services for each ticket
      for (const ticket of tickets) {
        // Each ticket in the tickets array is guaranteed to have an id since we checked in the mapping process
        ticket.services = await getTicketServices(ticket.id);
      }
    }

    return tickets;
  } catch (error) {
    console.error('Error fetching pickup tickets:', error);
    toast.error('Error fetching tickets for pickup');
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
    console.error('Error marking ticket as delivered:', error);
    toast.error('Error al marcar el ticket como entregado');
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
      .select(`
        ${selectColumns},
        customers (name, phone)
      `)
      .eq('status', 'ready') // Only tickets that are ready for pickup
      .eq('is_canceled', false) // Not canceled
      .lte('created_at', cutoffDate.toISOString()) // Created before the cutoff date
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Transform data to match the Ticket type with better error handling
    const tickets: Ticket[] = [];
    
    for (const rawTicketData of data) {
      // Skip invalid ticket data with additional safety check
      if (!rawTicketData || typeof rawTicketData !== 'object' || !rawTicketData.id) {
        continue;
      }
      
      // Use non-null assertion after explicit check
      const ticketData = rawTicketData!;
      
      const ticket: Ticket = {
        id: ticketData.id,
        ticketNumber: ticketData.ticket_number,
        basketTicketNumber: ticketData.basket_ticket_number,
        clientName: ticketData.customers?.name || '',
        phoneNumber: ticketData.customers?.phone || '',
        services: [], // This will be populated by getTicketServices if needed
        paymentMethod: ticketData.payment_method,
        totalPrice: ticketData.total,
        status: ticketData.status,
        createdAt: ticketData.created_at,
        updatedAt: ticketData.updated_at,
        isPaid: ticketData.is_paid
      };
      
      tickets.push(ticket);
    }

    return tickets;
  } catch (error) {
    console.error(`Error fetching unretrieved tickets (${days} days):`, error);
    toast.error(`Error al obtener tickets no retirados (${days} días)`);
    return [];
  }
};
