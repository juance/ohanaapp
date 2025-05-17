
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';
import { formatTicketData, createDetailedTicketMessage, formatPhoneForWhatsApp } from '../utils/ticketFormatters';
import { shareTicketPDFViaWhatsApp } from '@/utils/pdfUtils';
import { getTicketOptions } from '@/lib/ticket/ticketServiceCore';
import { openWhatsApp } from '@/lib/utils/whatsappUtils';

/**
 * Hook for ticket notification operations
 */
export const useTicketNotificationOperations = () => {
  /**
   * Shares a ticket via WhatsApp with PDF attachment
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

        ticket = formatTicketData(ticketData, dryCleaningItems);
      }
      
      if (!ticket) {
        toast.error('Ticket no encontrado');
        return;
      }
      
      // Ensure ticket has services property to prevent errors
      if (!ticket.services) {
        ticket.services = [];
      }

      // Get laundry options for the ticket
      const laundryOptions = await getTicketOptions(ticketId);
      
      // Format phone number and share the PDF via WhatsApp
      const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
      shareTicketPDFViaWhatsApp(formattedPhone, ticket, laundryOptions);

    } catch (err: any) {
      console.error("Error preparing WhatsApp message:", err);
      toast.error(`Error al preparar mensaje de WhatsApp: ${err.message}`);
    }
  }, []);

  /**
   * Notifies a client with a text message via WhatsApp
   */
  const handleNotifyClient = useCallback(async (ticketId: string, phoneNumber: string | undefined, tickets: Ticket[] | undefined): Promise<void> => {
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

        ticket = formatTicketData(ticketData, dryCleaningItems);
      }
      
      if (!ticket) {
        toast.error('Ticket no encontrado');
        return;
      }
      
      // Ensure ticket has services property to prevent errors
      if (!ticket.services) {
        ticket.services = [];
      }
      
      // Create the simplified message format as requested
      const message = createSimplifiedTicketMessage(ticket);
      
      // Send WhatsApp message with ticket details
      const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
      openWhatsApp(formattedPhone, message);

    } catch (err: any) {
      console.error("Error sending notification message:", err);
      toast.error(`Error al enviar notificación: ${err.message}`);
    }
  }, []);

  /**
   * Creates the simplified message format as requested by the user
   */
  const createSimplifiedTicketMessage = (ticket: Ticket): string => {
    // Format date
    const date = new Date(ticket.createdAt);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    let message = `*Tickets de Lavandería*\n*COPIA*\n\n*Lavandería Ohana*\nFecha: ${formattedDate}\n\n`;
    message += `Cliente: ${ticket.clientName}\n`;
    message += `Teléfono: ${ticket.phoneNumber}\n\n`;
    message += `Método de pago: ${getPaymentMethodText(ticket.paymentMethod)}\n`;
    message += `Total: $${ticket.totalPrice.toLocaleString()}\n\n`;
    message += `Ticket #${ticket.ticketNumber}\n`;
    message += '¡Gracias por elegirnos!';
    
    return message;
  };

  /**
   * Format payment method for display
   */
  const getPaymentMethodText = (method?: string): string => {
    switch (method) {
      case 'cash': return 'efectivo';
      case 'debit': return 'débito';
      case 'credit': return 'crédito';
      case 'mercadopago': return 'Mercado Pago';
      case 'cuenta_dni': return 'Cuenta DNI';
      case 'cuentaDni': return 'Cuenta DNI';
      case 'transfer': return 'transferencia';
      default: return method || 'No especificado';
    }
  };

  return {
    handleShareWhatsApp,
    handleNotifyClient
  };
};
