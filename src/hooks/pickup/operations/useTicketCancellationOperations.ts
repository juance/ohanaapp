
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Hook for ticket cancellation operations
 */
export const useTicketCancellationOperations = () => {
  /**
   * Cancels a ticket
   */
  const handleCancelTicket = useCallback(async (ticketId: string, cancelReason: string): Promise<void> => {
    if (!ticketId) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: 'cancelled', 
          cancel_reason: cancelReason 
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success('Ticket cancelado correctamente');
    } catch (err: any) {
      console.error("Error cancelling ticket:", err);
      toast.error(`Error al cancelar ticket: ${err.message}`);
    }
  }, []);

  return { handleCancelTicket };
};
