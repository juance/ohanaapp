
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { toast } from '@/lib/toast';
import { getCustomerById } from '@/lib/dataService';

/**
 * Get all tickets that are ready for pickup
 * @returns Array of ready tickets
 */
export const getReadyTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        id,
        ticket_number,
        customer_id,
        total,
        payment_method,
        status,
        is_paid,
        created_at,
        valet_quantity
      `)
      .eq('status', 'ready')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get customer data for each ticket
    const ticketsWithClientData = await Promise.all(
      data.map(async (ticket) => {
        let clientName = '';
        let phoneNumber = '';

        if (ticket.customer_id) {
          try {
            const customer = await getCustomerById(ticket.customer_id);
            if (customer) {
              clientName = customer.name;
              phoneNumber = customer.phone;
            }
          } catch (err) {
            console.error(`Error fetching customer data for ticket ${ticket.id}:`, err);
          }
        }

        return {
          id: ticket.id,
          ticketNumber: ticket.ticket_number,
          clientName,
          phoneNumber,
          totalPrice: Number(ticket.total),
          paymentMethod: ticket.payment_method,
          status: ticket.status,
          isPaid: ticket.is_paid,
          valetQuantity: ticket.valet_quantity,
          createdAt: ticket.created_at,
          deliveredDate: null // Adding this to match the Ticket interface
        };
      })
    );

    return ticketsWithClientData;
  } catch (error) {
    console.error('Error fetching ready tickets:', error);
    throw error;
  }
};

/**
 * Mark a ticket as delivered
 * @param ticketId The ticket ID
 * @param paymentMethod Payment method if paying now
 * @param paymentAmount Amount paid
 * @returns Success status
 */
export const markTicketAsDelivered = async (
  ticketId: string,
  paymentMethod?: string,
  paymentAmount?: number
): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    
    // Start building the update object
    const updateData: any = {
      status: 'delivered',
      delivered_date: now
    };
    
    // If payment info is provided, update payment status
    if (paymentMethod) {
      updateData.payment_method = paymentMethod;
      updateData.is_paid = true;
      
      if (paymentAmount !== undefined) {
        updateData.payment_amount = paymentAmount;
      }
    }
    
    const { error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Error al marcar el ticket como entregado');
      return false;
    }

    toast.success('Ticket marcado como entregado exitosamente');
    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    toast.error('Error al marcar el ticket como entregado');
    return false;
  }
};

/**
 * Get all tickets that have been delivered
 * @param limit Optional limit for number of tickets to return
 * @returns Array of delivered tickets
 */
export const getDeliveredTickets = async (limit?: number): Promise<Ticket[]> => {
  try {
    let query = supabase
      .from('tickets')
      .select(`
        id,
        ticket_number,
        customer_id,
        total,
        payment_method,
        status,
        is_paid,
        created_at,
        delivered_date,
        valet_quantity
      `)
      .eq('status', 'delivered')
      .order('delivered_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Get customer data for each ticket
    const ticketsWithClientData = await Promise.all(
      data.map(async (ticket) => {
        let clientName = '';
        let phoneNumber = '';

        if (ticket.customer_id) {
          try {
            const customer = await getCustomerById(ticket.customer_id);
            if (customer) {
              clientName = customer.name;
              phoneNumber = customer.phone;
            }
          } catch (err) {
            console.error(`Error fetching customer data for ticket ${ticket.id}:`, err);
          }
        }

        return {
          id: ticket.id,
          ticketNumber: ticket.ticket_number,
          clientName,
          phoneNumber,
          totalPrice: Number(ticket.total),
          paymentMethod: ticket.payment_method,
          status: ticket.status,
          isPaid: ticket.is_paid,
          valetQuantity: ticket.valet_quantity,
          createdAt: ticket.created_at,
          deliveredDate: ticket.delivered_date
        };
      })
    );

    return ticketsWithClientData;
  } catch (error) {
    console.error('Error fetching delivered tickets:', error);
    throw error;
  }
};
