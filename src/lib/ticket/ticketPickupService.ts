import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';

/**
 * Get tickets that are ready for pickup (status ready, processing or pending)
 */
export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (
          name,
          phone
        )
      `)
      .in('status', ['ready', 'processing', 'pending'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert to our application format
    return data.map((ticket: any): Ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Cliente sin nombre',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || 'cash',
      status: ticket.status || 'pending',
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date || null
    }));
  } catch (error) {
    console.error('Error fetching pickup tickets:', error);
    throw error;
  }
};

/**
 * Get recent tickets (limit: 30)
 */
export const getRecentTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (
          name,
          phone
        )
      `)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;

    // Convert to our application format
    return data.map((ticket: any): Ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Cliente sin nombre',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || 'cash',
      status: ticket.status || 'pending',
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date || null
    }));
  } catch (error) {
    console.error('Error fetching recent tickets:', error);
    throw error;
  }
};

/**
 * Marks a ticket as delivered by updating its status to 'delivered' and setting the delivered_date.
 * @param {string} ticketId The ID of the ticket to mark as delivered.
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful, false otherwise.
 */
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({ status: 'delivered', delivered_date: new Date().toISOString() })
      .eq('id', ticketId);

    if (error) {
      console.error('Error marking ticket as delivered:', error);
      toast.error('Error al marcar el ticket como entregado');
      return false;
    }

    toast.success('Ticket marcado como entregado');
    return true;
  } catch (error) {
    console.error('Unexpected error marking ticket as delivered:', error);
    toast.error('Error inesperado al marcar el ticket como entregado');
    return false;
  }
};

/**
 * Marks a ticket as pending by updating its status to 'pending'.
 * @param {string} ticketId The ID of the ticket to mark as pending.
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful, false otherwise.
 */
export const markTicketAsPending = async (ticketId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({ status: 'pending' })
      .eq('id', ticketId);

    if (error) {
      console.error('Error marking ticket as pending:', error);
      toast.error('Error al marcar el ticket como pendiente');
      return false;
    }

    toast.success('Ticket marcado como pendiente');
    return true;
  } catch (error) {
    console.error('Unexpected error marking ticket as pending:', error);
    toast.error('Error inesperado al marcar el ticket como pendiente');
    return false;
  }
};

/**
 * Retrieves a list of tickets that have not been retrieved, meaning they are not delivered or canceled.
 * @returns {Promise<Ticket[]>} A promise that resolves to an array of Ticket objects.
 */
export const getUnretrievedTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        id, 
        ticket_number,
        total,
        payment_method,
        status,
        is_paid,
        created_at,
        delivered_date,
        customers (name, phone)
      `)
      .not('status', 'in', ['delivered', 'canceled'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching unretrieved tickets:', error);
      toast.error('Error al cargar los tickets no entregados');
      return [];
    }

    return data.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Unknown',
      phoneNumber: ticket.customers?.phone || 'N/A',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || 'cash',
      status: ticket.status || 'pending',
      isPaid: ticket.is_paid || false,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date
    }));
  } catch (error) {
    console.error('Unexpected error fetching unretrieved tickets:', error);
    toast.error('Error inesperado al cargar los tickets no entregados');
    return [];
  }
};

/**
 * Cancels a ticket by updating its status to 'canceled'.
 * @param {string} ticketId The ID of the ticket to cancel.
 * @param {string} cancelReason The reason for canceling the ticket.
 * @returns {Promise<boolean>} A promise that resolves to true if the cancellation was successful, false otherwise.
 */
export const cancelTicket = async (ticketId: string, cancelReason: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({ status: 'canceled', cancel_reason: cancelReason })
      .eq('id', ticketId);

    if (error) {
      console.error('Error canceling ticket:', error);
      toast.error('Error al cancelar el ticket');
      return false;
    }

    toast.success('Ticket cancelado exitosamente');
    return true;
  } catch (error) {
    console.error('Unexpected error canceling ticket:', error);
    toast.error('Error inesperado al cancelar el ticket');
    return false;
  }
};

/**
 * Marks a ticket as paid in advance.
 * @param {string} ticketId The ID of the ticket to mark as paid in advance.
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful, false otherwise.
 */
export const markTicketAsPaidInAdvance = async (ticketId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({ is_paid: true })
      .eq('id', ticketId);

    if (error) {
      console.error('Error marking ticket as paid in advance:', error);
      toast.error('Error al marcar el ticket como pagado por adelantado');
      return false;
    }

    toast.success('Ticket marcado como pagado por adelantado');
    return true;
  } catch (error) {
    console.error('Unexpected error marking ticket as paid in advance:', error);
    toast.error('Error inesperado al marcar el ticket como pagado por adelantado');
    return false;
  }
};

/**
 * Retrieves a list of tickets that are marked as delivered.
 * @returns {Promise<Ticket[]>} A promise that resolves to an array of Ticket objects.
 */
export const getDeliveredTickets = async (): Promise<Ticket[]> => {
    try {
      const query = buildTicketSelectQuery()
        .eq('status', 'delivered')
        .order('created_at', { ascending: false });
  
      const { data, error } = await query;
  
      if (error) {
        console.error('Error fetching delivered tickets:', error);
        toast.error('Error al cargar los tickets entregados');
        return [];
      }
  
      return data.map(mapTicketData);
    } catch (error) {
      console.error('Unexpected error fetching delivered tickets:', error);
      toast.error('Error inesperado al cargar los tickets entregados');
      return [];
    }
  };

  /**
 * Updates the payment method for a specific ticket.
 * @param {string} ticketId - The ID of the ticket to update.
 * @param {string} paymentMethod - The new payment method to set for the ticket.
 * @returns {Promise<boolean>} - Returns true if the update was successful, false otherwise.
 */
export const updateTicketPaymentMethod = async (ticketId: string, paymentMethod: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({ payment_method: paymentMethod })
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket payment method:', error);
      toast.error('Error al actualizar el método de pago del ticket');
      return false;
    }

    toast.success('Método de pago del ticket actualizado exitosamente');
    return true;
  } catch (error) {
    console.error('Unexpected error updating ticket payment method:', error);
    toast.error('Error inesperado al actualizar el método de pago del ticket');
    return false;
  }
};
