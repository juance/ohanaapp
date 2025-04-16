
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData, checkTicketsCustomersRelationExists } from './ticketQueryUtils';
import { TICKET_STATUS } from '@/lib/constants/appConstants';
import { isDelivered, isPending, getDatabaseStatuses } from './ticketStatusService';

/**
 * Get tickets for a specific phone number
 */
export const getTicketsByPhoneNumber = async (phoneNumber: string): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();

    // Verificar si existe la relación entre tickets y customers
    const relationExists = await checkTicketsCustomersRelationExists();

    // First get the customer ID for the phone number
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phoneNumber)
      .single();

    if (customerError || !customer) {
      console.error('Error finding customer by phone number:', customerError);
      return [];
    }

    // Si existe la relación, usar una sola consulta
    if (relationExists) {
      console.log('Usando relación entre tickets y customers para obtener tickets por teléfono');

      // Construir la consulta con la relación
      let query = `
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
        customers (id, name, phone)
      `;

      // Añadir delivered_date si existe
      if (hasDeliveredDateColumn) {
        query += `, delivered_date`;
      }

      // Obtener tickets para este cliente usando la relación
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select(query)
        .eq('customer_id', customer.id)
        .eq('is_canceled', false)
        .order('created_at', { ascending: false });

      if (ticketsError) {
        console.error('Error retrieving customer tickets with relation:', ticketsError);
      } else if (ticketsData) {
        console.log(`Obtenidos ${ticketsData.length} tickets usando la relación`);

        // Map to application Ticket model
        const tickets = ticketsData
          .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
          .filter(ticket => ticket !== null) as Ticket[];

        return tickets;
      }
    }

    // Si no existe la relación o hubo un error, usar el método alternativo
    console.log('Usando método alternativo para obtener tickets por teléfono');

    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);

    // Get tickets for this customer, both ready/pending and delivered
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('tickets')
      .select(selectQuery)
      .eq('customer_id', customer.id)
      .eq('is_canceled', false)
      .order('created_at', { ascending: false });

    if (ticketsError) {
      console.error('Error retrieving customer tickets:', ticketsError);
      return [];
    }

    // Map to application Ticket model
    const tickets = ticketsData
      .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
      .filter(ticket => ticket !== null) as Ticket[];

    return tickets;
  } catch (error) {
    console.error('Error retrieving customer tickets:', error);
    return [];
  }
};

/**
 * Get delivered tickets for a specific phone number
 */
export const getDeliveredTicketsByPhoneNumber = async (phoneNumber: string): Promise<Ticket[]> => {
  const allTickets = await getTicketsByPhoneNumber(phoneNumber);
  return allTickets.filter(ticket => isDelivered(ticket.status));
};

/**
 * Get pending/ready tickets for a specific phone number
 */
export const getPendingTicketsByPhoneNumber = async (phoneNumber: string): Promise<Ticket[]> => {
  const allTickets = await getTicketsByPhoneNumber(phoneNumber);
  return allTickets.filter(ticket => isPending(ticket.status));
};
