
import { supabase } from '@/integrations/supabase/client';

/**
 * Mark a ticket as delivered
 */
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        is_paid: true,
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

/**
 * Cancel a ticket
 */
export const cancelTicket = async (ticketId: string, reason: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        is_canceled: true,
        status: 'canceled',
        cancel_reason: reason
      })
      .eq('id', ticketId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    return false;
  }
};
