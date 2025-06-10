
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

export interface TicketWithCustomer {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  createdAt: string;
  customer?: {
    name: string;
    phone: string;
  };
}

/**
 * Get unretrieved tickets (ready but not delivered)
 */
export const getUnretrievedTickets = async (): Promise<TicketWithCustomer[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        id,
        ticket_number,
        total,
        created_at,
        customers (name, phone)
      `)
      .eq('status', 'ready')
      .is('delivered_date', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Cliente sin nombre',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: Number(ticket.total || 0),
      createdAt: ticket.created_at,
      customer: ticket.customers
    }));
  } catch (error) {
    console.error('Error fetching unretrieved tickets:', error);
    return [];
  }
};

/**
 * Mark a ticket as delivered
 */
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        delivered_date: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    return false;
  }
};
