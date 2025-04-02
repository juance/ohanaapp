
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Cancel a ticket
export const cancelTicket = async (ticketId: string, reason: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        is_canceled: true,
        cancel_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) throw error;
    
    toast("Ticket anulado correctamente");
    return true;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    toast("Error al anular el ticket");
    return false;
  }
};
