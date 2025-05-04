
import { supabase } from '@/integrations/supabase/client';
import { Ticket, LaundryOption, PaymentMethod } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { checkColumnExists } from '@/integrations/supabase/postgresUtils';

/**
 * Check if delivered_date column exists in tickets table
 */
export const checkDeliveredDateColumnExists = async (): Promise<boolean> => {
  return await checkColumnExists('tickets', 'delivered_date');
};

/**
 * Build a query string for tickets table that works with or without delivered_date
 */
export const buildTicketSelectQuery = async () => {
  // Check if we need to include the delivered_date column
  const hasDeliveredDate = await checkDeliveredDateColumnExists();
  
  // Return the appropriate query
  if (hasDeliveredDate) {
    return supabase.from('tickets').select('*, customers(name, phone)');
  } else {
    return supabase.from('tickets').select('*, customers(name, phone)');
  }
};

/**
 * Map database ticket data to Ticket interface
 */
export const mapTicketData = (ticket: any): Ticket => {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticket_number || '000',
    clientName: ticket.customers?.name || 'Cliente',
    phoneNumber: ticket.customers?.phone || '',
    totalPrice: ticket.total || 0,
    total: ticket.total || 0,
    paymentMethod: (ticket.payment_method as PaymentMethod) || 'cash',
    status: ticket.status || 'pending',
    isPaid: ticket.is_paid || false,
    valetQuantity: ticket.valet_quantity || 0,
    createdAt: ticket.created_at,
    date: ticket.date || ticket.created_at,
    deliveredDate: ticket.delivered_date,
    customerId: ticket.customer_id,
    basketTicketNumber: ticket.basket_ticket_number
  };
};

/**
 * Map database laundry options to LaundryOption interface
 */
export const mapLaundryOptionsData = (options: any[]): LaundryOption[] => {
  if (!options || !Array.isArray(options)) return [];
  
  return options.map(opt => ({
    id: opt.id,
    type: opt.option_type,
    name: opt.option_type,
    optionType: opt.option_type
  }));
};
