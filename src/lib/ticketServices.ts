
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types/ticket.types';

// Types
export interface TicketWithCustomer extends Ticket {
  customer: {
    name: string;
    phone?: string;
  };
}

// Helper function to map payment methods
const mapPaymentMethod = (method: string | null): 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni' => {
  switch (method) {
    case 'debit':
      return 'debit';
    case 'mercadopago':
      return 'mercadopago';
    case 'cuenta_dni':
      return 'cuenta_dni';
    case 'cash':
    default:
      return 'cash';
  }
};

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
      paymentMethod: mapPaymentMethod(ticket.payment_method),
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
      paymentMethod: mapPaymentMethod(ticket.payment_method),
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

export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'delivered',
        delivered_date: new Date().toISOString(),
        is_paid: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as delivered:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markTicketAsDelivered:', error);
    return false;
  }
};
