
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';

/**
 * Check if delivered_date column exists in the tickets table
 */
export const checkDeliveredDateColumnExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('delivered_date')
      .limit(1);

    if (error && error.message.includes('column "delivered_date" does not exist')) {
      console.log('delivered_date column does not exist');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking for delivered_date column:', error);
    return false;
  }
};

/**
 * Build the select query based on available columns
 */
export const buildTicketSelectQuery = (hasDeliveredDateColumn: boolean): string => {
  let baseQuery = `
    id,
    ticket_number,
    total,
    payment_method,
    status,
    date,
    is_paid,
    is_canceled,
    valet_quantity,
    created_at,
    updated_at,
    basket_ticket_number,
    customers (
      id,
      name,
      phone
    )
  `;

  // Add delivered_date if it exists
  if (hasDeliveredDateColumn) {
    baseQuery += `, delivered_date`;
  }

  return baseQuery;
};

/**
 * Map ticket data from Supabase to application Ticket model
 */
export const mapTicketData = (ticket: any, hasDeliveredDateColumn: boolean): Ticket | null => {
  // Verify ticket has required properties before mapping
  if (!ticket || typeof ticket !== 'object' || !ticket.id) {
    console.error('Invalid ticket data for mapping:', ticket);
    return null;
  }

  console.log('Mapping ticket:', ticket.id, ticket.ticket_number, ticket.status);

  const customerData = ticket.customers || {};

  // Handle both possible column names for delivered date
  let deliveredDate;
  if (hasDeliveredDateColumn && ticket.delivered_date) {
    deliveredDate = ticket.delivered_date;
  } else if (ticket.delivered_at) {
    deliveredDate = ticket.delivered_at;
  }

  // Ensure all required fields have default values if missing
  const ticketNumber = ticket.ticket_number || 'N/A';
  const totalPrice = typeof ticket.total === 'number' ? ticket.total : 0;
  const paymentMethod = ticket.payment_method || 'cash';
  const status = ticket.status || 'pending';
  const createdAt = ticket.created_at || new Date().toISOString();

  const mappedTicket: Ticket = {
    id: ticket.id,
    ticketNumber: ticketNumber,
    basketTicketNumber: ticket.basket_ticket_number || undefined,
    clientName: customerData.name || '',
    phoneNumber: customerData.phone || '',
    services: [], // Will be populated by getTicketServices later
    paymentMethod: paymentMethod as any,
    totalPrice: totalPrice,
    status: status as 'pending' | 'processing' | 'ready' | 'delivered',
    createdAt: createdAt,
    updatedAt: ticket.updated_at,
    deliveredDate: deliveredDate,
    deliveredAt: ticket.delivered_at,
    isPaid: ticket.is_paid || false,
    isCanceled: ticket.is_canceled || false,
    valetQuantity: ticket.valet_quantity || 0
  };

  return mappedTicket;
};
