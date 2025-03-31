
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
    
    toast.success('Ticket marcado como pagado por adelantado');
    return true;
  } catch (error) {
    console.error('Error marking ticket as paid:', error);
    toast.error('Error al marcar el ticket como pagado');
    return false;
  }
};

// Get tickets that haven't been retrieved after 45 and 90 days
export const getUnretrievedTickets = async (): Promise<{ tickets45Days: any[], tickets90Days: any[] }> => {
  try {
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    // Get tickets with status 'ready' that were created more than 45 days ago
    const { data: readyTickets, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (name, phone)
      `)
      .eq('status', 'ready')
      .eq('is_canceled', false)
      .lt('created_at', fortyFiveDaysAgo.toISOString())
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Transform data
    const ticketsWithData = readyTickets.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total,
      createdAt: ticket.created_at,
    }));
    
    // Split into 45 days and 90 days categories
    const tickets45Days = ticketsWithData.filter((ticket: any) => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate >= ninetyDaysAgo && ticketDate <= fortyFiveDaysAgo;
    });
    
    const tickets90Days = ticketsWithData.filter((ticket: any) => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate < ninetyDaysAgo;
    });
    
    return { tickets45Days, tickets90Days };
  } catch (error) {
    console.error('Error fetching unretrieved tickets:', error);
    return { tickets45Days: [], tickets90Days: [] };
  }
};
