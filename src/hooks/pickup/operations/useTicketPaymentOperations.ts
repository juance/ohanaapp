
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Hook for ticket payment operations
 */
export const useTicketPaymentOperations = () => {
  /**
   * Updates the payment method of a ticket
   */
  const handleUpdatePaymentMethod = useCallback(async (ticketId: string, paymentMethod: string): Promise<void> => {
    if (!ticketId) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ payment_method: paymentMethod })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success('Método de pago actualizado correctamente');
    } catch (err: any) {
      console.error("Error updating payment method:", err);
      toast.error(`Error al actualizar método de pago: ${err.message}`);
    }
  }, []);

  return { handleUpdatePaymentMethod };
};
