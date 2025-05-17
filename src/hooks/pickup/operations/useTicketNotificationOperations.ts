
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';
import { formatTicketData, createDetailedTicketMessage, formatPhoneForWhatsApp } from '../utils/ticketFormatters';

/**
 * Hook for ticket notification operations
 */
export const useTicketNotificationOperations = () => {
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

        ticket = formatTicketData(ticketData, dryCleaningItems);
      }
      
      if (!ticket) {
        toast.error('Ticket no encontrado');
        return;
      }

      // Create a detailed message with ticket information
      const message = createDetailedTicketMessage(ticket);

      // Format phone number and open WhatsApp
      const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
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
    handleShareWhatsApp,
    handleNotifyClient
  };
};
