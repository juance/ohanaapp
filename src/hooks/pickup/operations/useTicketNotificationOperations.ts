
import { useCallback } from 'react';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';
import { getTicket } from '../services/ticketFetchService';
import { sendTicketNotification, shareTicketPDF } from '../services/notificationService';

/**
 * Hook for ticket notification operations
 */
export const useTicketNotificationOperations = () => {
  /**
   * Shares a ticket via WhatsApp with PDF attachment
   */
  const handleShareWhatsApp = useCallback(async (
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
      
      // Share the PDF via WhatsApp
      await shareTicketPDF(phoneNumber, ticket);

    } catch (err: any) {
      console.error("Error preparing WhatsApp message:", err);
      toast.error(`Error al preparar mensaje de WhatsApp: ${err.message}`);
    }
  }, []);

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

  return {
    handleShareWhatsApp,
    handleNotifyClient
  };
};
