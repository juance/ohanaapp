
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Hook for ticket delivery operations
 */
export const useTicketDeliveryOperations = () => {
  /**
   * Marks a ticket as delivered and paid
   */
  const handleMarkAsDelivered = useCallback(async (ticketId: string): Promise<void> => {
    try {
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('tickets')
        .update({
          status: 'delivered',
          delivered_date: now,
          is_paid: true, // Mark as paid when delivering
          updated_at: now
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success('Ticket marcado como entregado y pagado');
    } catch (err: any) {
      toast.error(`Error al marcar como entregado: ${err.message}`);
      console.error("Error marking ticket as delivered:", err);
    }
  }, []);

  return { handleMarkAsDelivered };
};
