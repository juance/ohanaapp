
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';

/**
 * Hook for ticket operations like marking as delivered, cancelling, etc.
 */
export const usePickupTicketOperations = () => {
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

  /**
   * Print ticket functionality (placeholder)
   */
  const handlePrintTicket = useCallback((ticketId: string): void => {
    console.log('Imprimir ticket:', ticketId);
    toast.info('Función de impresión no implementada');
  }, []);

  /**
   * Shares a ticket via WhatsApp
   */
  const handleShareWhatsApp = useCallback((ticketId: string, phoneNumber: string | undefined, tickets: Ticket[] | undefined): void => {
    if (!phoneNumber) {
      toast.error('No hay número de teléfono para este cliente');
      return;
    }

    const ticket = tickets?.find(t => t.id === ticketId);
    if (!ticket) {
      toast.error('Ticket no encontrado');
      return;
    }

    const message = `Hola! Tu pedido #${ticket.ticketNumber} está listo para retirar. Total: $${ticket.totalPrice}. Gracias por tu compra!`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, []);

  /**
   * Notifies a client (currently uses WhatsApp)
   */
  const handleNotifyClient = useCallback((ticketId: string, phoneNumber: string | undefined, tickets: Ticket[] | undefined): void => {
    handleShareWhatsApp(ticketId, phoneNumber, tickets);
  }, [handleShareWhatsApp]);

  return {
    handleMarkAsDelivered,
    handleCancelTicket,
    handleUpdatePaymentMethod,
    handlePrintTicket,
    handleShareWhatsApp,
    handleNotifyClient
  };
};
