
import { Ticket } from '@/lib/types';

/**
 * Format payment method for display
 */
export const getPaymentMethodText = (method?: string): string => {
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

/**
 * Creates the simplified message format for ticket notifications
 */
export const createSimplifiedTicketMessage = (ticket: Ticket): string => {
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
 * Creates a detailed message with ticket information including items
 */
export const createDetailedTicketMessage = (ticket: Ticket): string => {
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
  
  return message;
};
