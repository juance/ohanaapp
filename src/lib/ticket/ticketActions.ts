
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Cancel a ticket
export const cancelTicket = async (ticketId: string, reason: string): Promise<boolean> => {
  try {
    // Input validation
    if (!ticketId) throw new Error('No ticket ID provided');
    if (!reason.trim()) throw new Error('Reason for cancellation is required');
    
    const { error, data } = await supabase
      .from('tickets')
      .update({
        is_canceled: true,
        cancel_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select();
      
    if (error) {
      console.error('Error details:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    // Check if the update affected any rows
    if (data && data.length === 0) {
      throw new Error('Ticket not found or already canceled');
    }
    
    toast.success("Ticket anulado correctamente");
    return true;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error desconocido al anular el ticket';
    
    toast.error("Error", errorMessage);
    return false;
  }
};
