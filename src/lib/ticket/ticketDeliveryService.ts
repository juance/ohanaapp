
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { checkDeliveredDateColumnExists, buildTicketSelectQuery, mapTicketData, checkTicketsCustomersRelationExists } from './ticketQueryUtils';
import { TICKET_STATUS } from '@/lib/constants/appConstants';

/**
 * Get list of delivered tickets
 */
export const getDeliveredTickets = async (startDate?: Date, endDate?: Date): Promise<Ticket[]> => {
  try {
    // First check if delivered_date column exists
    const hasDeliveredDate = await checkDeliveredDateColumnExists();

    // Verificar si existe la relación entre tickets y customers
    const relationExists = await checkTicketsCustomersRelationExists();

    // Si existe la relación, usar una sola consulta
    if (relationExists) {
      console.log('Usando relación entre tickets y customers para obtener tickets entregados');

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
      if (hasDeliveredDate) {
        query += `, delivered_date`;
      }

      let queryBuilder = supabase.from('tickets')
        .select(query)
        .eq('status', TICKET_STATUS.DELIVERED)
        .order('updated_at', { ascending: false });

      // Add date filters if provided
      if (startDate) {
        queryBuilder = queryBuilder.gte('date', startDate.toISOString());
      }

      if (endDate) {
        queryBuilder = queryBuilder.lte('date', endDate.toISOString());
      }

      const { data: ticketsData, error } = await queryBuilder;

      if (error) {
        console.error('Error retrieving delivered tickets with relation:', error);
      } else if (ticketsData && Array.isArray(ticketsData)) {
        console.log(`Obtenidos ${ticketsData.length} tickets entregados usando la relación`);

        // Transform data to match application types
        return ticketsData
          .filter(ticket => ticket && typeof ticket === 'object')
          .map(ticket => mapTicketData(ticket, hasDeliveredDate))
          .filter((ticket): ticket is Ticket => ticket !== null);
      }
    }

    // Si no existe la relación o hubo un error, usar el método alternativo
    console.log('Usando método alternativo para obtener tickets entregados');

    let query = supabase.from('tickets')
      .select(buildTicketSelectQuery(hasDeliveredDate))
      .eq('status', TICKET_STATUS.DELIVERED)
      .order('updated_at', { ascending: false });

    // Add date filters if provided
    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }

    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Transform data to match application types
    return data
      .filter(ticket => ticket && typeof ticket === 'object')
      .map(ticket => mapTicketData(ticket, hasDeliveredDate))
      .filter((ticket): ticket is Ticket => ticket !== null);
  } catch (error) {
    console.error('Error fetching delivered tickets:', error);
    return [];
  }
};
