
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';

/**
 * Check if delivered_date column exists in the tickets table
 */
export const checkDeliveredDateColumnExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'tickets')
      .eq('column_name', 'delivered_date');

    if (error) throw error;

    return data && data.length > 0;
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
  console.log('Mapping ticket data:', ticket ? ticket.id : 'null');

  // Verify ticket has required properties before mapping
  if (!ticket || typeof ticket !== 'object' || !ticket.id) {
    console.error('Invalid ticket data for mapping:', ticket);
    return null;
  }

  console.log('Ticket data to map:', JSON.stringify({
    id: ticket.id,
    ticket_number: ticket.ticket_number,
    status: ticket.status,
    customer: ticket.customers,
    total: ticket.total,
    payment_method: ticket.payment_method
  }, null, 2));

  const customerData = ticket.customers || {};

  // Handle both possible column names for delivered date
  let deliveredDate;
  if (hasDeliveredDateColumn) {
    if (ticket.delivered_date) {
      deliveredDate = ticket.delivered_date;
    } else if (ticket.delivered_at) {
      deliveredDate = ticket.delivered_at;
    }
  }

  // Ensure all required fields are present
  if (!ticket.ticket_number) {
    console.error('Missing required field ticket_number:', ticket);
    return null;
  }

  if (ticket.total === undefined || ticket.total === null) {
    console.error('Missing required field total:', ticket);
    return null;
  }

  if (!ticket.payment_method) {
    console.error('Missing required field payment_method:', ticket);
    return null;
  }

  if (!ticket.status) {
    console.error('Missing required field status:', ticket);
    return null;
  }

  if (!ticket.created_at) {
    console.error('Missing required field created_at:', ticket);
    return null;
  }

  const mappedTicket = {
    id: ticket.id,
    ticketNumber: ticket.ticket_number,
    basketTicketNumber: ticket.basket_ticket_number,
    clientName: customerData.name || '',
    phoneNumber: customerData.phone || '',
    services: [], // Will be populated by getTicketServices later
    paymentMethod: ticket.payment_method as any, // Cast to PaymentMethod
    totalPrice: ticket.total,
    status: ticket.status as 'pending' | 'processing' | 'ready' | 'delivered', // Cast to valid status
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
    deliveredDate: deliveredDate,
    deliveredAt: ticket.delivered_at,
    isPaid: ticket.is_paid,
    isCanceled: ticket.is_canceled || false,
    valetQuantity: ticket.valet_quantity || 0
  };

  console.log('Mapped ticket:', JSON.stringify({
    id: mappedTicket.id,
    ticketNumber: mappedTicket.ticketNumber,
    status: mappedTicket.status,
    clientName: mappedTicket.clientName,
    totalPrice: mappedTicket.totalPrice,
    paymentMethod: mappedTicket.paymentMethod
  }, null, 2));

  return mappedTicket;
};
