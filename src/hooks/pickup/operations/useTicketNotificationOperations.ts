
import { useCallback } from 'react';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';
import { getTicket } from '../services/ticketFetchService';
import { sendTicketNotification, sendOrderReadyNotification } from '../services/notificationService';
import { markTicketAsReady } from '@/lib/ticket/ticketStatusTransitionService';

/**
 * Hook for ticket notification operations
 */
export const useTicketNotificationOperations = () => {
  /**
   * Notifies a client with a text message via WhatsApp
   */
  const handleNotifyClient = useCallback(async (
    ticketId: string, 
    phoneNumber: string | undefined, 
    tickets?: Ticket[]
  ): Promise<void> => {
    if (!phoneNumber) {
      toast.error('No hay número de teléfono para este cliente');
      return;
    }

    try {
      const ticket = await getTicket(ticketId, tickets);
      
      if (!ticket) {
        toast.error('Ticket no encontrado');
        return;
      }
      
      // Ensure ticket has services property to prevent errors
      if (!ticket.services) {
        ticket.services = [];
      }
      
      // Send WhatsApp notification
      sendTicketNotification(phoneNumber, ticket);

    } catch (err: any) {
      console.error("Error sending notification message:", err);
      toast.error(`Error al enviar notificación: ${err.message}`);
    }
  }, []);

  /**
   * Marks a ticket as ready and notifies the client
   */
  const handleOrderReady = useCallback(async (
    ticketId: string,
    phoneNumber: string | undefined,
    tickets?: Ticket[]
  ): Promise<void> => {
    if (!phoneNumber) {
      toast.error('No hay número de teléfono para este cliente');
      return;
    }

    try {
      // First mark the ticket as ready in the database
      const success = await markTicketAsReady(ticketId);
      
      if (!success) {
        toast.error('Error al marcar el ticket como listo para retirar');
        return;
      }
      
      // Get the ticket data
      const ticket = await getTicket(ticketId, tickets);
      
      if (!ticket) {
        toast.error('Ticket no encontrado');
        return;
      }
      
      // Ensure ticket has services property to prevent errors
      if (!ticket.services) {
        ticket.services = [];
      }
      
      // Send order ready notification
      sendOrderReadyNotification(phoneNumber, ticket);
      
      toast.success('Cliente notificado que su pedido está listo para retirar');

    } catch (err: any) {
      console.error("Error sending order ready notification:", err);
      toast.error(`Error al enviar notificación: ${err.message}`);
    }
  }, []);

  return {
    handleNotifyClient,
    handleOrderReady
  };
};
