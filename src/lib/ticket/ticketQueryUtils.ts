
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
  if (!ticket) return null;
  
  try {
    return {
      id: ticket.id,
      ticketNumber: ticket.ticket_number || '',
      clientName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method as any,
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      status: ticket.status || '',
      createdAt: ticket.created_at || '',
      updatedAt: ticket.updated_at || '',
      basketTicketNumber: ticket.basket_ticket_number || '',
      deliveredAt: hasDeliveredDateColumn ? ticket.delivered_date : undefined,
      isCanceled: ticket.is_canceled || false,
    };
  } catch (error) {
    console.error('Error mapping ticket data:', error);
    return null;
  }
};
