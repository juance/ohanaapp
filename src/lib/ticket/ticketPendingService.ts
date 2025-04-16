import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData, checkTicketsCustomersRelationExists } from './ticketQueryUtils';
import { getDatabaseStatuses } from './ticketStatusService';

/**
 * Get all pending tickets (including ready tickets)
 */
export const getPendingTickets = async (): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();

    // Verificar si existe la relación entre tickets y customers
    const relationExists = await checkTicketsCustomersRelationExists();

    // Get all pending tickets (not delivered) using the status service
    const pendingStatuses = getDatabaseStatuses('PENDING');

    // Si existe la relación, usar una sola consulta
    if (relationExists) {
      console.log('Usando relación entre tickets y customers para obtener tickets pendientes');

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
        customers (id, name, phone),
        dry_cleaning_items (*)
      `;

      // Añadir delivered_date si existe
      if (hasDeliveredDateColumn) {
        query += `, delivered_date`;
      }

      const { data: ticketsData, error } = await supabase
        .from('tickets')
        .select(query)
        .in('status', pendingStatuses)
        .eq('is_canceled', false);

      if (error) {
        console.error('Error retrieving pending tickets with relation:', error);
      } else if (ticketsData) {
        console.log(`Obtenidos ${ticketsData.length} tickets pendientes usando la relación`);

        // Map to application Ticket model
        const tickets = ticketsData
          .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
          .filter(ticket => ticket !== null) as Ticket[];

        return tickets;
      }
    }

    // Si no existe la relación o hubo un error, usar el método alternativo
    console.log('Usando método alternativo para obtener tickets pendientes');

    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);

    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select(selectQuery)
      .in('status', pendingStatuses)
      .eq('is_canceled', false);

    if (error) {
      console.error('Error retrieving pending tickets:', error);
      throw error;
    }

    // Map to application Ticket model
    const tickets = ticketsData
      .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
      .filter(ticket => ticket !== null) as Ticket[];

    return tickets;
  } catch (error) {
    console.error('Error retrieving pending tickets:', error);
    return [];
  }
};

/**
 * Get tickets with status 'pending' or 'processing' (not including 'ready')
 */
export const getProcessingTickets = async (): Promise<Ticket[]> => {
  try {
    // Check if delivered_date column exists
    const hasDeliveredDateColumn = await checkDeliveredDateColumnExists();

    // Verificar si existe la relación entre tickets y customers
    const relationExists = await checkTicketsCustomersRelationExists();

    // Si existe la relación, usar una sola consulta
    if (relationExists) {
      console.log('Usando relación entre tickets y customers para obtener tickets en proceso');

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
        customers (id, name, phone),
        dry_cleaning_items (*)
      `;

      // Añadir delivered_date si existe
      if (hasDeliveredDateColumn) {
        query += `, delivered_date`;
      }

      const { data: ticketsData, error } = await supabase
        .from('tickets')
        .select(query)
        .in('status', ['pending', 'processing']) // We still use explicit values here as this is a subset
        .eq('is_canceled', false);

      if (error) {
        console.error('Error retrieving processing tickets with relation:', error);
      } else if (ticketsData) {
        console.log(`Obtenidos ${ticketsData.length} tickets en proceso usando la relación`);

        // Map to application Ticket model
        const tickets = ticketsData
          .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
          .filter(ticket => ticket !== null) as Ticket[];

        return tickets;
      }
    }

    // Si no existe la relación o hubo un error, usar el método alternativo
    console.log('Usando método alternativo para obtener tickets en proceso');

    // Build select query based on available columns
    const selectQuery = buildTicketSelectQuery(hasDeliveredDateColumn);

    // Get only tickets in 'pending' or 'processing' status (not 'ready')
    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select(selectQuery)
      .in('status', ['pending', 'processing']) // We still use explicit values here as this is a subset
      .eq('is_canceled', false);

    if (error) {
      console.error('Error retrieving processing tickets:', error);
      throw error;
    }

    // Map to application Ticket model
    const tickets = ticketsData
      .map(ticket => mapTicketData(ticket, hasDeliveredDateColumn))
      .filter(ticket => ticket !== null) as Ticket[];

    return tickets;
  } catch (error) {
    console.error('Error retrieving processing tickets:', error);
    return [];
  }
};
