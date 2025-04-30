
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { toast } from '@/lib/toast';

/**
 * Get all tickets that are ready for pickup (not delivered or canceled)
 */
export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (
          id, name, phone
        )
      `)
      .in('status', ['pending', 'processing', 'ready'])
      .is('delivered_date', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pickup tickets:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      ticketNumber: item.ticket_number,
      clientName: item.customers?.name || 'Unknown',
      phoneNumber: item.customers?.phone || '',
      totalPrice: item.total || 0,
      paymentMethod: item.payment_method || 'cash',
      status: item.status || 'pending',
      isPaid: item.is_paid || false,
      valetQuantity: item.valet_quantity || 0,
      createdAt: item.created_at,
      deliveredDate: item.delivered_date
    }));
  } catch (error) {
    console.error('Error in getPickupTickets:', error);
    return [];
  }
};

/**
 * Get tickets that weren't retrieved after a certain period
 */
export const getUnretrievedTickets = async (daysThreshold = 7): Promise<Ticket[]> => {
  try {
    // Calculate the date threshold
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (
          id, name, phone
        )
      `)
      .in('status', ['pending', 'processing', 'ready'])
      .is('delivered_date', null)
      .lt('created_at', thresholdDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching unretrieved tickets:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      ticketNumber: item.ticket_number,
      clientName: item.customers?.name || 'Unknown',
      phoneNumber: item.customers?.phone || '',
      totalPrice: item.total || 0,
      paymentMethod: item.payment_method || 'cash',
      status: item.status || 'pending',
      isPaid: item.is_paid || false,
      valetQuantity: item.valet_quantity || 0,
      createdAt: item.created_at,
      deliveredDate: item.delivered_date
    }));
  } catch (error) {
    console.error('Error in getUnretrievedTickets:', error);
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
        delivered_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as delivered:', error);
      toast.error('Error al marcar el ticket como entregado');
      return false;
    }
    
    toast.success('Ticket marcado como entregado exitosamente');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsDelivered:', error);
    toast.error('Error al marcar el ticket como entregado');
    return false;
  }
};

/**
 * Mark a ticket as pending (use when moving from ready back to pending)
 */
export const markTicketAsPending = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as pending:', error);
      toast.error('Error al marcar el ticket como pendiente');
      return false;
    }
    
    toast.success('Ticket marcado como pendiente');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsPending:', error);
    toast.error('Error al marcar el ticket como pendiente');
    return false;
  }
};

/**
 * Cancel a ticket
 */
export const cancelTicket = async (ticketId: string, reason: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'canceled',
        cancel_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error canceling ticket:', error);
      toast.error('Error al cancelar el ticket');
      return false;
    }
    
    toast.success('Ticket cancelado exitosamente');
    return true;
  } catch (error) {
    console.error('Error in cancelTicket:', error);
    toast.error('Error al cancelar el ticket');
    return false;
  }
};
