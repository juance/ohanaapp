import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from './types';
import { subDays } from 'date-fns';

// Get tickets that are ready for pickup
export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (name, phone)
      `)
      .eq('status', 'ready')
      .eq('is_canceled', false) // Only show non-canceled tickets
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match the Ticket type
    const tickets = data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      basketTicketNumber: ticket.basket_ticket_number,
      clientName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      services: [], // This will be populated by getTicketServices
      paymentMethod: ticket.payment_method,
      totalPrice: ticket.total,
      status: ticket.status,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at
    }));

    // Get services for each ticket
    for (const ticket of tickets) {
      ticket.services = await getTicketServices(ticket.id);
    }

    return tickets;
  } catch (error) {
    console.error('Error fetching pickup tickets:', error);
    toast.error('Error fetching tickets for pickup');
    return [];
  }
};

// Get tickets that have been delivered
export const getDeliveredTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (name, phone)
      `)
      .eq('status', 'delivered')
      .eq('is_canceled', false) // Only show non-canceled tickets
      .order('delivered_date', { ascending: false });

    if (error) throw error;

    const tickets = data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      basketTicketNumber: ticket.basket_ticket_number,
      clientName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      services: [], // This will be populated by getTicketServices
      paymentMethod: ticket.payment_method,
      totalPrice: ticket.total,
      status: ticket.status,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      deliveredDate: ticket.delivered_date
    }));

    // Get services for each ticket
    for (const ticket of tickets) {
      ticket.services = await getTicketServices(ticket.id);
    }

    return tickets;
  } catch (error) {
    console.error('Error fetching delivered tickets:', error);
    toast.error('Error fetching delivered tickets');
    return [];
  }
};

// Mark a ticket as delivered
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        is_paid: true, // Mark as paid when delivered
        delivered_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
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

// New function to mark a ticket as paid in advance
export const markTicketAsPaidInAdvance = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        is_paid: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) throw error;

    toast.success('Ticket marcado como pagado por adelantado');
    return true;
  } catch (error) {
    console.error('Error marking ticket as paid:', error);
    toast.error('Error al marcar el ticket como pagado');
    return false;
  }
};

// Cancel a ticket
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

    toast.success('Ticket anulado correctamente');
    return true;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    toast.error('Error al anular el ticket');
    return false;
  }
};

// Get ticket services (dry cleaning items) with immediate default values
export const getTicketServices = async (ticketId: string) => {
  // Return an empty default state immediately
  const defaultServices = [];

  try {
    // First, check if this is a valet ticket
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('valet_quantity, total')
      .eq('id', ticketId)
      .single();

    if (ticketError) {
      console.error('Error fetching ticket data:', ticketError);
      return defaultServices;
    }

    // If it has valet_quantity > 0, add it as a service
    if (ticketData && ticketData.valet_quantity > 0) {
      return [{
        name: 'Valet',
        price: ticketData.total / ticketData.valet_quantity,
        quantity: ticketData.valet_quantity
      }];
    }

    // Otherwise look for dry cleaning items
    const { data, error } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);

    if (error) {
      console.error('Error fetching ticket services:', error);
      return defaultServices;
    }

    // Only return populated data if we have items
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
    }

    return defaultServices;
  } catch (error) {
    console.error('Error fetching ticket services:', error);
    return defaultServices;
  }
};

// Get laundry options for a ticket
export const getTicketOptions = async (ticketId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('ticket_laundry_options')
      .select('option_type')
      .eq('ticket_id', ticketId);

    if (error) throw error;

    return data.map(item => item.option_type);
  } catch (error) {
    console.error('Error fetching ticket options:', error);
    return [];
  }
};

// Get tickets that haven't been retrieved for a specified number of days
export const getUnretrievedTickets = async (days: number): Promise<Ticket[]> => {
  try {
    // Calculate the cutoff date (current date minus specified days)
    const cutoffDate = subDays(new Date(), days);

    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (name, phone)
      `)
      .eq('status', 'ready') // Only tickets that are ready for pickup
      .eq('is_canceled', false) // Not canceled
      .lte('created_at', cutoffDate.toISOString()) // Created before the cutoff date
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match the Ticket type
    const tickets = data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      basketTicketNumber: ticket.basket_ticket_number,
      clientName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      services: [], // This will be populated by getTicketServices if needed
      paymentMethod: ticket.payment_method,
      totalPrice: ticket.total,
      status: ticket.status,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at
    }));

    return tickets;
  } catch (error) {
    console.error(`Error fetching unretrieved tickets (${days} days):`, error);
    toast.error(`Error al obtener tickets no retirados (${days} días)`);
    return [];
  }
};
