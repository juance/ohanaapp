
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Mark a ticket as ready for pickup
 */
export const markTicketAsReady = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'ready',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as ready:', error);
      toast.error('Error al marcar el ticket como listo para retirar');
      return false;
    }
    
    toast.success('Ticket marcado como listo para retirar');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsReady:', error);
    toast.error('Error al marcar el ticket como listo');
    return false;
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
        is_paid: true, // Assuming payment happens on delivery
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as delivered:', error);
      toast.error('Error al marcar el ticket como entregado');
      return false;
    }
    
    toast.success('Ticket marcado como entregado');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsDelivered:', error);
    toast.error('Error al marcar el ticket como entregado');
    return false;
  }
};

/**
 * Mark a ticket as processing
 */
export const markTicketAsProcessing = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as processing:', error);
      toast.error('Error al marcar el ticket como en proceso');
      return false;
    }
    
    toast.success('Ticket marcado como en proceso');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsProcessing:', error);
    toast.error('Error al marcar el ticket como en proceso');
    return false;
  }
};
