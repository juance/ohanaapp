
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';
import { handleTicketPrint as printTicket } from '@/utils/printUtils';
import { getTicketOptions } from '@/lib/ticket/ticketServiceCore';

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
   * Print ticket functionality
   */
  const handlePrintTicket = useCallback(async (ticketId: string): Promise<void> => {
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('*, customers(name, phone)')
        .eq('id', ticketId)
        .single();
      
      if (ticketError) throw ticketError;

      // Get dry cleaning items
      const { data: dryCleaningItems, error: itemsError } = await supabase
        .from('dry_cleaning_items')
        .select('*')
        .eq('ticket_id', ticketId);
      
      if (itemsError) throw itemsError;

      // Get laundry options
      const laundryOptions = await getTicketOptions(ticketId);
      
      // Format the ticket data
      const ticket: Ticket = {
        id: ticketData.id,
        ticketNumber: ticketData.ticket_number,
        clientName: ticketData.customers?.name || '',
        phoneNumber: ticketData.customers?.phone || '',
        total: ticketData.total || 0,
        totalPrice: ticketData.total || 0,
        status: ticketData.status,
        paymentMethod: ticketData.payment_method,
        date: ticketData.date,
        isPaid: ticketData.is_paid,
        createdAt: ticketData.created_at,
        deliveredDate: ticketData.delivered_date,
        basketTicketNumber: ticketData.basket_ticket_number || '',
        services: dryCleaningItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price || 0,
          quantity: item.quantity || 1
        }))
      };

      // Print the ticket
      printTicket(ticket, laundryOptions);
      
    } catch (err: any) {
      console.error("Error printing ticket:", err);
      toast.error(`Error al imprimir ticket: ${err.message}`);
    }
  }, []);

  /**
   * Shares a ticket via WhatsApp with detailed information
   */
  const handleShareWhatsApp = useCallback(async (ticketId: string, phoneNumber: string | undefined, tickets: Ticket[] | undefined): Promise<void> => {
    if (!phoneNumber) {
      toast.error('No hay número de teléfono para este cliente');
      return;
    }

    try {
      // If tickets are provided, try to find the ticket in the array first
      let ticket: Ticket | undefined;
      if (tickets && tickets.length > 0) {
        ticket = tickets.find(t => t.id === ticketId);
      }

      // If ticket wasn't found in the array or tickets array wasn't provided, fetch directly from DB
      if (!ticket) {
        const { data: ticketData, error: ticketError } = await supabase
          .from('tickets')
          .select('*, customers(name, phone)')
          .eq('id', ticketId)
          .single();
        
        if (ticketError) throw ticketError;

        // Get dry cleaning items
        const { data: dryCleaningItems, error: itemsError } = await supabase
          .from('dry_cleaning_items')
          .select('*')
          .eq('ticket_id', ticketId);
        
        if (itemsError) throw itemsError;

        ticket = {
          id: ticketData.id,
          ticketNumber: ticketData.ticket_number,
          clientName: ticketData.customers?.name || '',
          phoneNumber: ticketData.customers?.phone || '',
          total: ticketData.total || 0,
          totalPrice: ticketData.total || 0,
          status: ticketData.status,
          paymentMethod: ticketData.payment_method,
          date: ticketData.date,
          isPaid: ticketData.is_paid,
          createdAt: ticketData.created_at,
          deliveredDate: ticketData.delivered_date,
          basketTicketNumber: ticketData.basket_ticket_number || '',
          services: dryCleaningItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price || 0,
            quantity: item.quantity || 1
          }))
        };
      }
      
      if (!ticket) {
        toast.error('Ticket no encontrado');
        return;
      }

      // Create a detailed message with ticket information
      let message = `Hola! Tu pedido #${ticket.ticketNumber} está listo para retirar.\n\n`;
      
      // Add items to the message
      if (ticket.services && ticket.services.length > 0) {
        message += "Artículos:\n";
        ticket.services.forEach(service => {
          const quantity = service.quantity || 1;
          const price = service.price || 0;
          message += `- ${service.name} x${quantity}: $${price}\n`;
        });
        message += "\n";
      }
      
      if (ticket.basketTicketNumber) {
        message += `N° Canasto: ${ticket.basketTicketNumber}\n\n`;
      }
      
      message += `Total: $${ticket.totalPrice.toLocaleString()}\n\n`;
      message += "Gracias por tu confianza!";

      // Format phone number and open WhatsApp
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

    } catch (err: any) {
      console.error("Error preparing WhatsApp message:", err);
      toast.error(`Error al preparar mensaje de WhatsApp: ${err.message}`);
    }
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
