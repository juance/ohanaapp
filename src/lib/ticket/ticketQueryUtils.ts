
import { Ticket, DryCleaningItem, LaundryOption, PaymentMethod } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the delivered_date column exists in the tickets table
 */
export const checkDeliveredDateColumnExists = async (): Promise<boolean> => {
  try {
    // Just attempt a query that uses the delivered_date column
    await supabase
      .from('tickets')
      .select('delivered_date')
      .limit(1);
    
    return true;
  } catch (error) {
    console.error('Error checking delivered_date column:', error);
    return false;
  }
};

/**
 * Builds a select query for tickets based on status and other filters
 */
export const buildTicketSelectQuery = (status?: string | string[], limit?: number) => {
  let query = supabase
    .from('tickets')
    .select(`
      *,
      customers (id, name, phone),
      dry_cleaning_items (id, name, quantity, price),
      ticket_laundry_options (id, option_type)
    `)
    .order('created_at', { ascending: false });
    
  if (status) {
    if (Array.isArray(status)) {
      query = query.in('status', status);
    } else {
      query = query.eq('status', status);
    }
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  return query;
};

/**
 * Maps database ticket data to the Ticket interface
 */
export const mapTicketData = (data: any): Ticket => {
  // Extract dry cleaning items
  const dryCleaningItems: DryCleaningItem[] = data.dry_cleaning_items ? 
    data.dry_cleaning_items.map((item: any) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price || 0,
      ticketId: data.id
    })) : [];
  
  // Extract laundry options
  const laundryOptions: LaundryOption[] = data.ticket_laundry_options ?
    data.ticket_laundry_options.map((option: any) => ({
      id: option.id,
      name: option.option_type, // Map option_type to name
      optionType: option.option_type,
      ticketId: data.id,
      createdAt: option.created_at
    })) : [];
  
  // Map the ticket data
  return {
    id: data.id,
    ticketNumber: data.ticket_number || '',
    clientName: data.customers?.name || 'Cliente',
    phoneNumber: data.customers?.phone || '',
    totalPrice: data.total || 0,
    paymentMethod: (data.payment_method as PaymentMethod) || 'cash',
    status: data.status || 'pending',
    isPaid: data.is_paid || false,
    valetQuantity: data.valet_quantity || 0,
    createdAt: data.created_at || '',
    deliveredDate: data.delivered_date,
    customerId: data.customer_id,
    basketTicketNumber: data.basket_ticket_number,
    dryCleaningItems,
    laundryOptions
  };
};
