
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';

/**
 * Checks if the delivered_date column exists in the tickets table.
 * @returns {Promise<boolean>} A promise that resolves to true if the column exists, false otherwise.
 */
export const checkDeliveredDateColumnExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_column_exists', {
      table_name: 'tickets',
      column_name: 'delivered_date'
    });

    if (error) {
      console.error('Error checking column exists:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error checking column exists:', error);
    return false;
  }
};

/**
 * Checks if the customers relation exists for tickets table.
 * @returns {Promise<boolean>} A promise that resolves to true if the relation exists, false otherwise.
 */
export const checkTicketsCustomersRelationExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_relation_exists', {
      parent_table: 'customers',
      child_table: 'tickets',
      column_name: 'customer_id'
    });

    if (error) {
      console.error('Error checking relation exists:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error checking relation exists:', error);
    return false;
  }
};

/**
 * Builds a query to select tickets based on a status filter.
 * @param {string} statusFilter The status to filter tickets by.
 * @returns {PostgrestFilterBuilder} A Supabase query builder.
 */
export const buildTicketSelectQuery = (statusFilter?: string) => {
  let query = supabase
    .from('tickets')
    .select(`
      id, 
      ticket_number,
      basket_ticket_number,
      total,
      payment_method,
      status,
      is_paid,
      created_at,
      updated_at,
      delivered_date,
      valet_quantity,
      customers (
        id, name, phone
      ),
      dry_cleaning_items (
        id, name, quantity, price
      ),
      ticket_laundry_options (
        id, option_type
      )
    `);

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  return query.order('created_at', { ascending: false });
};

/**
 * Maps raw ticket data from the database to the Ticket type.
 * @param {any} ticket The raw ticket data from the database.
 * @param {boolean} hasDeliveredDate Whether the delivered_date column exists.
 * @returns {Ticket} A mapped Ticket object.
 */
export const mapTicketData = (ticket: any, hasDeliveredDate?: boolean): Ticket => {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticket_number,
    basketTicketNumber: ticket.basket_ticket_number,
    clientName: ticket.customers?.name || '',
    phoneNumber: ticket.customers?.phone || '',
    totalPrice: ticket.total || 0,
    paymentMethod: ticket.payment_method || 'cash',
    status: ticket.status || 'pending',
    isPaid: ticket.is_paid || false,
    valetQuantity: ticket.valet_quantity || 0,
    dryCleaningItems: ticket.dry_cleaning_items?.map((item: any) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price || 0
    })) || [],
    laundryOptions: ticket.ticket_laundry_options?.map((option: any) => ({
      id: option.id,
      name: option.option_type,
      price: 0
    })) || [],
    createdAt: ticket.created_at,
    deliveredDate: ticket.delivered_date,
    // Add updatedAt as an optional field to Ticket type
    updatedAt: ticket.updated_at || ticket.created_at
  };
};
