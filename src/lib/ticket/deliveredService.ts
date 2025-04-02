
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Ticket } from '../types';
import { getTicketServices } from './serviceDetails';

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
    toast("Error fetching delivered tickets");
    return [];
  }
};
