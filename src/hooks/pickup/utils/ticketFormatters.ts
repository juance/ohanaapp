import { Ticket } from '@/lib/types';
import { DryCleaningItem } from '@/lib/types/ticket.types';
import { TicketService } from '@/lib/types/ticket.types';

/**
 * Formats raw ticket data from the database into a structured Ticket object
 * @param rawTicket Raw ticket data from the database
 * @returns Formatted Ticket object
 */
export const formatTicketData = (rawTicket: any): Ticket => {
  // Extract customer data if available
  const customer = rawTicket.customers || null;
  
  // Format the ticket data
  return {
    id: rawTicket.id,
    ticketNumber: rawTicket.ticket_number || rawTicket.ticketNumber,
    clientName: customer?.name || rawTicket.client_name || '',
    phoneNumber: customer?.phone || rawTicket.phone_number || '',
    total: parseFloat(rawTicket.total) || 0,
    totalPrice: parseFloat(rawTicket.total) || 0, // Ensure totalPrice exists
    paymentMethod: rawTicket.payment_method || 'cash',
    status: rawTicket.status || 'pending',
    isPaid: rawTicket.is_paid || false,
    createdAt: rawTicket.created_at || new Date().toISOString(), // Ensure createdAt exists
    date: rawTicket.date || new Date().toISOString(),
    deliveredDate: rawTicket.delivered_date || null,
    valetQuantity: rawTicket.valet_quantity || 0,
    customerId: rawTicket.customer_id || null,
    services: [], // Initialize as empty array for compatibility
    customer: customer ? {
      name: customer.name,
      phone: customer.phone
    } : undefined
  };
};
