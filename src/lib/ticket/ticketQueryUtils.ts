
import { supabase } from '@/integrations/supabase/client';

// Comprueba si existe la columna delivered_date en la tabla tickets
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

// Construye la consulta SQL para seleccionar columnas incluyendo delivered_date si existe
export const buildTicketSelectQuery = async (includeDeliveredDate = false): Promise<string> => {
  // Si se especificó incluir delivered_date, verificar primero si existe
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

// Función auxiliar para mapear datos de ticket a objeto Ticket
export const mapTicketData = (ticket: any, customerData: any, hasDeliveredDateColumn: boolean): any => {
  // Verifica que ticket tenga las propiedades necesarias
  if (!ticket || typeof ticket !== 'object' || !ticket.id) {
    console.error('Invalid ticket data:', ticket);
    return null;
  }

  return {
    id: ticket.id,
    ticketNumber: ticket.ticket_number,
    basketTicketNumber: ticket.basket_ticket_number,
    clientName: customerData?.name || '',
    phoneNumber: customerData?.phone || '',
    services: [], // Will be populated by getTicketServices
    paymentMethod: ticket.payment_method as any, // Cast to PaymentMethod
    totalPrice: ticket.total,
    status: ticket.status as 'pending' | 'processing' | 'ready' | 'delivered', // Cast to valid status
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
    deliveredDate: hasDeliveredDateColumn && ticket.delivered_date ? ticket.delivered_date : undefined,
    isPaid: ticket.is_paid
  };
};
