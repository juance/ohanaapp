
import { Ticket, LaundryOption, DryCleaningItem, TicketService } from '@/lib/types';

/**
 * Maps database ticket data to Ticket format
 */
export const formatTicketData = (
  ticketData: any, 
  dryCleaningItems: DryCleaningItem[]
): Ticket => {
  return {
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
    basketTicketNumber: (ticketData as any).basket_ticket_number || '',
    services: mapDryCleaningItemsToServices(dryCleaningItems),
    valetQuantity: ticketData.valet_quantity || 0
  };
};

/**
 * Maps dry cleaning items to ticket services
 */
export const mapDryCleaningItemsToServices = (
  items: DryCleaningItem[]
): TicketService[] => {
  return items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price || 0,
    quantity: item.quantity || 1
  }));
};

/**
 * Creates a detailed WhatsApp message with ticket information
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

/**
 * Format phone number for WhatsApp
 */
export const formatPhoneForWhatsApp = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, '');
};

/**
 * Creates a simplified WhatsApp notification message
 * This matches the format shown in the example image
 */
export const createSimpleTicketMessage = (ticket: Ticket): string => {
  let message = `*Lavandería Ohana*\n\n`;
  message += `Hola! Tu pedido #${ticket.ticketNumber} está listo para retirar.\n\n`;
  
  if (ticket.basketTicketNumber) {
    message += `N° Canasto: ${ticket.basketTicketNumber}\n`;
  }
  
  message += `Total: $${ticket.totalPrice.toLocaleString()}\n\n`;
  message += "Gracias por tu confianza!";
  
  return message;
};
