
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types/ticket.types';

// Types
export interface TicketWithCustomer extends Ticket {
  customer: {
    name: string;
    phone?: string;
  };
}

export const getUnretrievedTickets = async (): Promise<TicketWithCustomer[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers!inner(name, phone_number)
      `)
      .in('status', ['pending', 'in_progress']);

    if (error) {
      console.error('Error fetching unretrieved tickets:', error);
      throw error;
    }

    if (!data) return [];

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || ticket.client_name,
      phoneNumber: ticket.customers?.phone_number || ticket.phone_number,
      totalPrice: ticket.total_price,
      total: ticket.total_price,
      status: ticket.status,
      createdAt: ticket.created_at,
      customerId: ticket.customer_id,
      paymentMethod: ticket.payment_method as 'cash' | 'card' | 'transfer' | 'pending',
      isPaid: ticket.is_paid || false,
      date: ticket.created_at,
      valetQuantity: ticket.valet_quantity || 0,
      customer: {
        name: ticket.customers?.name || ticket.client_name || 'Cliente no encontrado',
        phone: ticket.customers?.phone_number || ticket.phone_number
      }
    }));
  } catch (error) {
    console.error('Error in getUnretrievedTickets:', error);
    throw error;
  }
};

export const getAllTickets = async (): Promise<TicketWithCustomer[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers(name, phone_number)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all tickets:', error);
      throw error;
    }

    if (!data) return [];

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || ticket.client_name,
      phoneNumber: ticket.customers?.phone_number || ticket.phone_number,
      totalPrice: ticket.total_price,
      total: ticket.total_price,
      status: ticket.status,
      createdAt: ticket.created_at,
      customerId: ticket.customer_id,
      paymentMethod: ticket.payment_method as 'cash' | 'card' | 'transfer' | 'pending',
      isPaid: ticket.is_paid || false,
      date: ticket.created_at,
      valetQuantity: ticket.valet_quantity || 0,
      customer: {
        name: ticket.customers?.name || ticket.client_name || 'Cliente no encontrado',
        phone: ticket.customers?.phone_number || ticket.phone_number
      }
    }));
  } catch (error) {
    console.error('Error in getAllTickets:', error);
    throw error;
  }
};
