
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Ticket } from '../types';
import { getTicketServices } from './serviceDetails';

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
      isPaid: ticket.is_paid
    }));
    
    // Get services for each ticket
    for (const ticket of tickets) {
      ticket.services = await getTicketServices(ticket.id);
    }
    
    return tickets;
  } catch (error) {
    console.error('Error fetching pickup tickets:', error);
    toast.error("Error al obtener tickets", {
      description: "Error al cargar tickets para retiro"
    });
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
    
    toast.success("Ticket entregado", {
      description: "Ticket marcado como entregado y pagado"
    });
    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    toast.error("Error", {
      description: "Error al marcar el ticket como entregado"
    });
    return false;
  }
};

// Mark a ticket as paid in advance
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
    
    toast.success("Pago registrado", {
      description: "Ticket marcado como pagado por adelantado"
    });
    return true;
  } catch (error) {
    console.error('Error marking ticket as paid:', error);
    toast.error("Error", {
      description: "Error al marcar el ticket como pagado"
    });
    return false;
  }
};
