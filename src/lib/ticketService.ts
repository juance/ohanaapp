
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Ticket } from './types';

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
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      services: [], // This will be populated by getTicketServices
      paymentMethod: ticket.payment_method,
      totalPrice: ticket.total,
      status: ticket.status,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at
    }));
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
      .order('delivered_date', { ascending: false });
      
    if (error) throw error;
    
    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
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
        delivered_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
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

// Get ticket services (dry cleaning items) with immediate default values
export const getTicketServices = async (ticketId: string) => {
  // Return an empty default state immediately
  const defaultServices = [];
  
  try {
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
