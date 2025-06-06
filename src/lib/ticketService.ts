
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';

export const getTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (
          id,
          name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }

    return (data || []).map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Cliente sin nombre',
      phoneNumber: ticket.customers?.phone || '',
      total: ticket.total || 0,
      totalPrice: ticket.total || 0, // Agregando totalPrice
      paymentMethod: ticket.payment_method || '',
      status: ticket.status,
      date: ticket.date || ticket.created_at,
      createdAt: ticket.created_at, // Agregando createdAt
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      customerId: ticket.customer_id
    }));
  } catch (error) {
    console.error('Error getting tickets:', error);
    return [];
  }
};

export const updateTicketStatus = async (ticketId: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return false;
  }
};

export const updateTicketPaymentStatus = async (ticketId: string, isPaid: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ is_paid: isPaid })
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket payment status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating ticket payment status:', error);
    return false;
  }
};

export const updateTicketPaymentMethod = async (ticketId: string, paymentMethod: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ payment_method: paymentMethod })
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket payment method:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating ticket payment method:', error);
    return false;
  }
};

export const cancelTicket = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'canceled', is_canceled: true })
      .eq('id', ticketId);

    if (error) {
      console.error('Error cancelling ticket:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error cancelling ticket:', error);
    return false;
  }
};

export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'delivered', delivered_date: new Date().toISOString() })
      .eq('id', ticketId);

    if (error) {
      console.error('Error marking ticket as delivered:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    return false;
  }
};

export const getTicketServices = async (ticketId: string) => {
  try {
    console.log('Fetching services for ticket:', ticketId);
    
    // Get dry cleaning items
    const { data: dryCleaningItems, error: dryCleaningError } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);

    if (dryCleaningError) {
      console.error('Error fetching dry cleaning items:', dryCleaningError);
      throw dryCleaningError;
    }

    // Get laundry options
    const { data: laundryOptions, error: laundryError } = await supabase
      .from('ticket_laundry_options')
      .select('*')
      .eq('ticket_id', ticketId);

    if (laundryError) {
      console.error('Error fetching laundry options:', laundryError);
      throw laundryError;
    }

    console.log('Dry cleaning items found:', dryCleaningItems);
    console.log('Laundry options found:', laundryOptions);

    return {
      dryCleaningItems: dryCleaningItems || [],
      laundryOptions: laundryOptions || []
    };
  } catch (error) {
    console.error('Error in getTicketServices:', error);
    return {
      dryCleaningItems: [],
      laundryOptions: []
    };
  }
};

export const getReadyTickets = async () => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (
          id,
          name,
          phone
        )
      `)
      .eq('status', 'ready')
      .eq('is_canceled', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ready tickets:', error);
      throw error;
    }

    return (data || []).map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Cliente sin nombre',
      phoneNumber: ticket.customers?.phone || '',
      total: ticket.total || 0,
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || '',
      status: ticket.status,
      date: ticket.date || ticket.created_at,
      createdAt: ticket.created_at,
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      customerId: ticket.customer_id
    }));
  } catch (error) {
    console.error('Error getting ready tickets:', error);
    return [];
  }
};

export const getDeliveredTickets = async () => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (
          id,
          name,
          phone
        )
      `)
      .eq('status', 'delivered')
      .eq('is_canceled', false)
      .order('delivered_date', { ascending: false });

    if (error) {
      console.error('Error fetching delivered tickets:', error);
      throw error;
    }

    return (data || []).map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Cliente sin nombre',
      phoneNumber: ticket.customers?.phone || '',
      total: ticket.total || 0,
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || '',
      status: ticket.status,
      date: ticket.date || ticket.created_at,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      customerId: ticket.customer_id
    }));
  } catch (error) {
    console.error('Error getting delivered tickets:', error);
    return [];
  }
};
