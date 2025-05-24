
import { supabase } from '@/integrations/supabase/client';

export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  customerId?: string;
}

// Obtener tickets no retirados
export const getUnretrievedTickets = async (daysSinceReady: number = 7): Promise<Ticket[]> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceReady);
    
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select(`
        id,
        ticket_number,
        total,
        status,
        created_at,
        customer_id,
        customers(name, phone)
      `)
      .eq('status', 'ready')
      .lt('created_at', cutoffDate.toISOString())
      .eq('is_canceled', false);
    
    if (error) {
      console.error('Error fetching unretrieved tickets:', error);
      throw error;
    }
    
    return (tickets || []).map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Cliente no especificado',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      status: ticket.status,
      createdAt: ticket.created_at,
      customerId: ticket.customer_id
    }));
    
  } catch (error) {
    console.error('Error in getUnretrievedTickets:', error);
    throw error;
  }
};

// Marcar ticket como entregado
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        delivered_date: new Date().toISOString()
      })
      .eq('id', ticketId);
    
    if (error) {
      console.error('Error marking ticket as delivered:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markTicketAsDelivered:', error);
    return false;
  }
};

// Obtener estadísticas de tickets
export const getTicketStats = async () => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('status, total, created_at')
      .eq('is_canceled', false);
    
    if (error) {
      console.error('Error fetching ticket stats:', error);
      throw error;
    }
    
    const stats = {
      total: data?.length || 0,
      pending: data?.filter(t => t.status === 'pending').length || 0,
      ready: data?.filter(t => t.status === 'ready').length || 0,
      delivered: data?.filter(t => t.status === 'delivered').length || 0,
      totalRevenue: data?.reduce((sum, t) => sum + (t.total || 0), 0) || 0
    };
    
    return stats;
  } catch (error) {
    console.error('Error in getTicketStats:', error);
    throw error;
  }
};
