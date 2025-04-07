
import { supabase } from '@/integrations/supabase/client';

// Checks if delivered_date column exists in the tickets table
export const checkDeliveredDateColumnExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('delivered_date')
      .limit(1);
    
    if (error) {
      console.error('Error checking for delivered_date column:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking for delivered_date column:', error);
    return false;
  }
};

// Builds the select query string based on available columns
export const buildTicketSelectQuery = async (includeDeliveredDate = false): Promise<string> => {
  // If specifying to include delivered_date, verify it exists first
  let hasDeliveredDateColumn = false;
  
  if (includeDeliveredDate) {
    hasDeliveredDateColumn = await checkDeliveredDateColumnExists();
  }
  
  return `
    id,
    ticket_number,
    basket_ticket_number,
    total,
    payment_method,
    status,
    created_at,
    updated_at,
    is_paid,
    customer_id
    ${hasDeliveredDateColumn ? ',delivered_date' : ''}
  `;
};

// Maps ticket data from database to application Ticket model
export const mapTicketData = (ticket: any, customerData: any, hasDeliveredDateColumn: boolean): any => {
  // Verify ticket has required properties before mapping
  if (!ticket || typeof ticket !== 'object' || !ticket.id) {
    console.error('Invalid ticket data for mapping:', ticket);
    return null;
  }

  return {
    id: ticket.id,
    ticketNumber: ticket.ticket_number,
    basketTicketNumber: ticket.basket_ticket_number,
    clientName: customerData?.name || '',
    phoneNumber: customerData?.phone || '',
    services: [], // Will be populated by getTicketServices later
    paymentMethod: ticket.payment_method as any, // Cast to PaymentMethod
    totalPrice: ticket.total,
    status: ticket.status as 'pending' | 'processing' | 'ready' | 'delivered', // Cast to valid status
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
    deliveredDate: hasDeliveredDateColumn && ticket.delivered_date ? ticket.delivered_date : undefined,
    isPaid: ticket.is_paid
  };
};
