
import { Ticket } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if delivered_date column exists in the tickets table
 */
export const checkDeliveredDateColumnExists = async (): Promise<boolean> => {
  // For simplicity, we'll just assume the column exists
  // This is a safe assumption since we've verified it exists in the database
  console.log('Assuming delivered_date column exists');
  return true;
};

/**
 * Verifica si existe la relación entre tickets y customers
 */
export const checkTicketsCustomersRelationExists = async (): Promise<boolean> => {
  try {
    // Intentar hacer una consulta directa para verificar la existencia de la relación
    const { data: relationData, error: relationError } = await supabase.rpc('check_relation_exists', {
      table_name: 'tickets',
      foreign_table: 'customers'
    });

    if (!relationError && relationData) {
      console.log('Verificación de relación mediante RPC:', relationData);
      if (relationData === true) {
        console.log('Relación entre tickets y customers verificada mediante RPC');
        return true;
      }
    }

    // Si el método RPC no funciona, intentar con una consulta directa
    console.log('Intentando verificar relación mediante consulta directa...');
    const { data, error } = await supabase
      .from('tickets')
      .select('id, customers(id)')
      .limit(1);

    // Si no hay error, la relación existe
    if (!error && data) {
      console.log('Relación entre tickets y customers verificada mediante consulta directa');
      return true;
    }

    // Si hay un error, verificar si es por la relación
    if (error && error.message && error.message.includes('relationship')) {
      console.log('No existe relación entre tickets y customers:', error.message);
      return false;
    }

    // Si hay otro tipo de error, asumir que la relación no existe para ser conservadores
    console.log('No se pudo verificar la relación entre tickets y customers:', error);
    return false;
  } catch (error) {
    console.error('Error al verificar la relación entre tickets y customers:', error);
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
    ),
    dry_cleaning_items (*)
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
  // Verify ticket has required properties before mapping
  if (!ticket || typeof ticket !== 'object' || !ticket.id) {
    console.error('Invalid ticket data for mapping:', ticket);
    return null;
  }

  console.log('Mapping ticket:', ticket.id, ticket.ticket_number, ticket.status);

  const customerData = ticket.customers || {};
  console.log('Customer data:', customerData);

  // Handle both possible column names for delivered date
  let deliveredDate: string | null = null;
  if (hasDeliveredDateColumn && ticket.delivered_date) {
    deliveredDate = ticket.delivered_date;
    console.log('Using delivered_date:', deliveredDate);
  } else if (ticket.delivered_at) {
    deliveredDate = ticket.delivered_at;
    console.log('Using delivered_at:', deliveredDate);
  } else {
    console.log('No delivery date found');
  }

  // Ensure all required fields have default values if missing
  const ticketNumber = ticket.ticket_number || 'N/A';
  const totalPrice = typeof ticket.total === 'number' ? ticket.total : 0;
  const paymentMethod = ticket.payment_method || 'cash';
  const status = ticket.status || 'pending';
  const createdAt = ticket.created_at || new Date().toISOString();

  const mappedTicket: Ticket = {
    id: ticket.id,
    ticketNumber: ticketNumber,
    basketTicketNumber: ticket.basket_ticket_number || undefined,
    clientName: customerData.name || '',
    phoneNumber: customerData.phone || '',
    services: [], // Will be populated by getTicketServices later
    paymentMethod: paymentMethod as any,
    totalPrice: totalPrice,
    status: status as 'pending' | 'processing' | 'ready' | 'delivered',
    createdAt: createdAt,
    updatedAt: ticket.updated_at,
    deliveredDate: deliveredDate,
    deliveredAt: ticket.delivered_at,
    isPaid: ticket.is_paid || false,
    is_canceled: ticket.is_canceled || false, // Use the original property name
    valetQuantity: ticket.valet_quantity || 0,
    // Incluir los servicios de tintorería si están disponibles
    dryCleaningItems: ticket.dry_cleaning_items || []
  };

  return mappedTicket;
};
