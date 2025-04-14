
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';

// Checks if delivered_date or delivered_at column exists in the tickets table
export const checkDeliveredDateColumnExists = async (): Promise<boolean> => {
  try {
    // First try with delivered_date
    try {
      const { data: data1, error: error1 } = await supabase
        .from('tickets')
        .select('delivered_date')
        .limit(1);

      if (!error1) {
        console.log('delivered_date column exists');
        return true;
      }
    } catch (e) {
      // Silently fail and try the next option
    }

    // Then try with delivered_at
    try {
      const { data: data2, error: error2 } = await supabase
        .from('tickets')
        .select('delivered_at')
        .limit(1);

      if (!error2) {
        console.log('delivered_at column exists');
        return true;
      }
    } catch (e) {
      // Silently fail
    }

    console.error('Neither delivered_date nor delivered_at column exists');
    return false;
  } catch (error) {
    console.error('Error checking for delivered date columns:', error);
    return false;
  }
};

// Builds the select query string based on available columns
export const buildTicketSelectQuery = (includeDeliveredDate = false): string => {
  // Build the base query
  let query = `
    id,
    ticket_number,
    basket_ticket_number,
    total,
    payment_method,
    status,
    created_at,
    updated_at,
    is_paid,
    is_canceled,
    customer_id,
    customers (
      name,
      phone
    )
  `;

  // Add delivered_date if it should be included
  if (includeDeliveredDate) {
    // We'll try to handle both column names in the mapping function
    query += `,delivered_date,delivered_at`;
  }

  return query;
};

// Maps ticket data from database to application Ticket model
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
    customer: ticket.customers
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
    isPaid: ticket.is_paid
  };

  console.log('Mapped ticket:', JSON.stringify({
    id: mappedTicket.id,
    ticketNumber: mappedTicket.ticketNumber,
    status: mappedTicket.status,
    clientName: mappedTicket.clientName
  }, null, 2));

  return mappedTicket;
};
