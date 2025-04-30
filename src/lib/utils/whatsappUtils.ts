
import { Ticket } from '@/lib/types';

/**
 * Build a WhatsApp message for a ticket
 * @param ticket The ticket to build the message for
 * @returns Formatted message string
 */
export const buildTicketWhatsAppMessage = (ticket: Ticket): string => {
  // Format date for better readability
  const createdDate = new Date(ticket.createdAt).toLocaleDateString();
  
  // Base message with ticket info
  let message = `*Lavandería* - Ticket #${ticket.ticketNumber}\n`;
  message += `Fecha: ${createdDate}\n`;
  message += `Cliente: ${ticket.clientName}\n\n`;
  
  // Add services if available
  if (ticket.services && ticket.services.length > 0) {
    message += "*Servicios:*\n";
    ticket.services.forEach(service => {
      message += `- ${service.name} (${service.quantity}) x $${service.price}\n`;
    });
    message += "\n";
  }
  
  // Add dry cleaning items if available
  if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
    message += "*Tintorería:*\n";
    ticket.dryCleaningItems.forEach(item => {
      message += `- ${item.name} (${item.quantity}) x $${item.price}\n`;
    });
    message += "\n";
  }
  
  // Add laundry options if available
  if (ticket.laundryOptions && ticket.laundryOptions.length > 0) {
    message += "*Opciones:*\n";
    ticket.laundryOptions.forEach(option => {
      message += `- ${option.name}\n`;
    });
    message += "\n";
  }
  
  // Add total price
  message += `*Total: $${ticket.totalPrice}*\n`;
  message += `Método de pago: ${formatPaymentMethod(ticket.paymentMethod)}\n\n`;
  message += "¡Gracias por su preferencia!";
  
  return message;
};

/**
 * Format payment method to a more readable form
 */
const formatPaymentMethod = (method: string): string => {
  switch (method) {
    case 'cash': return 'Efectivo';
    case 'debit': return 'Tarjeta de débito';
    case 'credit': return 'Tarjeta de crédito';
    case 'mercadopago': return 'Mercado Pago';
    case 'transfer': return 'Transferencia';
    case 'cuentaDni': return 'Cuenta DNI';
    default: return method;
  }
};
