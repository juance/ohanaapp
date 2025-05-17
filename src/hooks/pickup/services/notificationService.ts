
import { Ticket } from '@/lib/types';
import { formatPhoneForWhatsApp } from '../utils/phoneUtils';
import { createSimplifiedTicketMessage, createDetailedTicketMessage } from '../utils/ticketMessageUtils';
import { openWhatsApp } from '@/lib/utils/whatsappUtils';
import { shareTicketPDFViaWhatsApp } from '@/utils/pdfUtils';
import { getTicketOptions } from '@/lib/ticket/ticketServiceCore';

/**
 * Sends a simple notification message via WhatsApp
 */
export const sendTicketNotification = (
  phoneNumber: string,
  ticket: Ticket
): void => {
  const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
  const message = createSimplifiedTicketMessage(ticket);
  openWhatsApp(formattedPhone, message);
};

/**
 * Shares a ticket PDF via WhatsApp
 */
export const shareTicketPDF = async (
  phoneNumber: string,
  ticket: Ticket
): Promise<void> => {
  const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
  
  // Get laundry options for the ticket
  const laundryOptions = await getTicketOptions(ticket.id);
  
  // Share PDF via WhatsApp
  shareTicketPDFViaWhatsApp(formattedPhone, ticket, laundryOptions);
};
