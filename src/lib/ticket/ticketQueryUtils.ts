
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkColumnExists } from '@/integrations/supabase/postgresUtils';

/**
 * Check if the delivered_date column exists in the tickets table
 */
export async function checkDeliveredDateColumnExists(): Promise<boolean> {
  return await checkColumnExists('tickets', 'delivered_date');
}

/**
 * Build the select query for tickets
 * @returns A select query builder for tickets
 */
export function buildTicketSelectQuery() {
  return supabase
    .from('tickets')
    .select(`
      *,
      customers (
        id, name, phone
      )
    `);
}

/**
 * Map database ticket record to application Ticket model
 */
export function mapTicketData(ticket: any): Ticket {
  if (!ticket) return null as any;
  
  // Map ticket data from database to application model
  return {
    id: ticket.id,
    ticketNumber: ticket.ticket_number,
    clientName: ticket.customers?.name || 'Cliente sin nombre',
    phoneNumber: ticket.customers?.phone || '',
    totalPrice: Number(ticket.total),
    total: Number(ticket.total), // Ensure total is always set
    paymentMethod: ticket.payment_method || 'cash',
    status: ticket.status || 'pending',
    isPaid: ticket.is_paid || false,
    valetQuantity: ticket.valet_quantity || 0,
    createdAt: ticket.created_at,
    date: ticket.date || ticket.created_at, // Ensure date is always set
    deliveredDate: ticket.delivered_date,
    customerId: ticket.customer_id
  };
}
