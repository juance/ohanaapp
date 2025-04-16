
import { supabase } from '@/integrations/supabase/client';
import { GenericStringError } from '@/lib/types/error.types';
import { Ticket } from '@/lib/types/ticket.types';

export const markTicketAsDelivered = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        delivered_date: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw {
        message: `Error updating ticket: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return data;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};

export const markTicketAsPending = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        status: 'pending',
        delivered_date: null
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw {
        message: `Error updating ticket: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return data;
  } catch (error) {
    console.error('Error marking ticket as pending:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};

export const updateTicketStatus = async (ticketId: string, newStatus: string) => {
  try {
    const validStatuses = ['pending', 'ready', 'delivered', 'canceled'];
    if (!validStatuses.includes(newStatus)) {
      return {
        message: `Estado no válido: ${newStatus}`
      };
    }

    const { error } = await supabase
      .from('tickets')
      .update({
        status: newStatus,
        delivered_date: newStatus === 'delivered' ? new Date().toISOString() : null
      })
      .eq('id', ticketId);

    if (error) {
      throw {
        message: `Error al actualizar el ticket: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return {
      message: `Ticket actualizado a estado: ${newStatus}`,
      id: ticketId
    };
  } catch (error) {
    console.error('Error updating ticket status:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};

export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    console.log('Fetching pickup tickets...');

    // First, check if there are any tickets with status 'ready' and not canceled
    const { count, error: countError } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ready')
      .eq('is_canceled', false);

    console.log('Count of ready tickets:', count);

    if (countError) {
      console.error('Error counting tickets:', countError);
      throw countError;
    }

    if (count === 0) {
      console.log('No tickets found with status ready and not canceled');
      return [];
    }

    // Simplificar la consulta para no depender de la relación con los clientes
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', 'ready')
      .eq('is_canceled', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }

    console.log('Fetched tickets:', data?.length || 0);

    if (!data || data.length === 0) {
      console.log('No tickets returned from query');
      return [];
    }

    // Map the tickets to the application format sin depender de la relación con los clientes
    const mappedTickets = data.map(ticket => {
      try {
        // Obtener el customer_id para posiblemente buscar el cliente después si es necesario
        const customerId = ticket.customer_id;

        return {
          id: ticket.id,
          ticketNumber: ticket.ticket_number,
          basketTicketNumber: ticket.basket_ticket_number,
          clientName: 'Cliente ' + ticket.ticket_number, // Usar el número de ticket como identificador temporal
          phoneNumber: '', // No tenemos el teléfono sin la relación
          totalPrice: ticket.total,
          paymentMethod: ticket.payment_method,
          status: ticket.status,
          isPaid: ticket.is_paid,
          valetQuantity: ticket.valet_quantity,
          createdAt: ticket.created_at,
          deliveredDate: ticket.delivered_date,
          customerId: customerId, // Guardar el ID del cliente para posible uso futuro
          ...ticket
        };
      } catch (mapError) {
        console.error('Error mapping ticket:', mapError, ticket);
        return null;
      }
    }).filter(Boolean) as Ticket[];

    console.log('Mapped tickets:', mappedTickets.length);
    return mappedTickets;
  } catch (error) {
    console.error('Error getting pickup tickets:', error);
    return [];
  }
};

export const getUnretrievedTickets = async (days: number): Promise<Ticket[]> => {
  try {
    const now = new Date();
    const dateXDaysAgo = new Date(now);
    dateXDaysAgo.setDate(now.getDate() - days);

    const { data, error } = await supabase
      .from('tickets')
      .select('*, customers(name, phone)')
      .eq('status', 'ready')
      .eq('is_canceled', false)
      .lt('created_at', dateXDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      basketTicketNumber: ticket.basket_ticket_number,
      clientName: ticket.customers?.name || 'Cliente sin nombre',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total,
      paymentMethod: ticket.payment_method,
      status: ticket.status,
      isPaid: ticket.is_paid,
      valetQuantity: ticket.valet_quantity,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      ...ticket
    }));
  } catch (error) {
    console.error(`Error getting unretrieved tickets after ${days} days:`, error);
    return [];
  }
};

export const cancelTicket = async (ticketId: string, reason?: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        status: 'canceled',
        is_canceled: true,
        cancel_reason: reason || 'No reason provided'
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw {
        message: `Error canceling ticket: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return data;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};
