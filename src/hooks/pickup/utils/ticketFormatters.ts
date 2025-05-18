
import { Ticket } from '@/lib/types/ticket.types';
import { DryCleaningItem, TicketService } from '@/lib/types/ticket.types';

/**
 * Formats ticket data from Supabase to match the Ticket interface
 */
export const formatTicketData = (
  ticketData: any,
  dryCleaningItems: DryCleaningItem[]
): Ticket => {
  return {
    id: ticketData.id,
    ticketNumber: ticketData.ticket_number,
    clientName: ticketData.customers?.name || 'Sin nombre',
    phoneNumber: ticketData.customers?.phone || ticketData.phone || '',
    total: ticketData.total || 0,
    totalPrice: ticketData.total || 0, // Map total to totalPrice for compatibility
    isPaid: ticketData.is_paid || false,
    status: ticketData.status || 'pending',
    paymentMethod: ticketData.payment_method || 'cash',
    createdAt: ticketData.created_at || new Date().toISOString(),
    date: ticketData.date || new Date().toISOString(),
    deliveredDate: ticketData.delivered_date || null,
    customerId: ticketData.customer_id || null,
    valetQuantity: ticketData.valet_quantity || 0,
    basketTicketNumber: ticketData.basket_ticket_number || null,
    dryCleaningItems: dryCleaningItems,
    services: dryCleaningItems.map(item => ({
      id: item.id,
      name: item.name || 'Servicio',
      price: item.price || 0,
      quantity: item.quantity || 1
    })),
    usesFreeValet: ticketData.uses_free_valet || false,
  };
};
