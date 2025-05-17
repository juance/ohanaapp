
import { Ticket } from '@/lib/types';
import { formatPhoneForWhatsApp } from '../utils/phoneUtils';
import { createSimplifiedTicketMessage, createDetailedTicketMessage, createOrderReadyMessage } from '../utils/ticketMessageUtils';
import { openWhatsApp } from '@/lib/utils/whatsappUtils';
import { getTicketOptions } from '@/lib/ticket/ticketServiceCore';
import { generateTicketPDF } from '@/utils/pdfUtils';

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
 * Sends an order ready notification via WhatsApp
 */
export const sendOrderReadyNotification = (
  phoneNumber: string,
  ticket: Ticket
): void => {
  const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
  const message = createOrderReadyMessage(ticket);
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

/**
 * Opens WhatsApp with a PDF ticket
 * @param phoneNumber The phone number to send the message to
 * @param ticket The ticket data
 * @param selectedOptions Additional laundry options
 */
export const shareTicketPDFViaWhatsApp = (
  phoneNumber: string, 
  ticket: Ticket, 
  selectedOptions: any[] = []
): void => {
  if (!phoneNumber) {
    console.error('No phone number provided');
    return;
  }
  
  // Ensure ticket has a services array to prevent errors
  if (!ticket.services) {
    ticket.services = [];
  }
  
  // Format phone number (remove spaces, dashes, etc.)
  const formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
  
  // Create a message with ticket details
  const message = `Hola! Tu pedido #${ticket.ticketNumber} ya está listo para retirar. Adjuntamos los detalles del ticket. Total: $${ticket.totalPrice?.toLocaleString()}. Gracias por tu compra!`;
  
  // Generate PDF data
  const pdfData = generateTicketPDF(ticket, selectedOptions);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message + '\n' + pdfData)}`;
  
  // Open WhatsApp in a new window
  window.open(whatsappUrl, '_blank');
};
