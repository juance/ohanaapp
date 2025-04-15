
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
    // Comprobar que el estado es válido
    const validStatuses = ['pending', 'ready', 'delivered', 'canceled'];
    if (!validStatuses.includes(newStatus)) {
      return {
        message: `Estado no válido: ${newStatus}`
      };
    }

    // Actualizar el ticket
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

// Función para obtener tickets listos para recoger
export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, customers(name, phone)')
      .eq('status', 'ready')
      .eq('is_canceled', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Mapear los datos de la BD al formato que espera la aplicación
    return (data || []).map(ticket => {
      const customerData = ticket.customers as { name: string; phone: string } | null;
      
      return {
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        basketTicketNumber: ticket.basket_ticket_number,
        clientName: customerData?.name || 'Cliente sin nombre',
        phoneNumber: customerData?.phone || '',
        totalPrice: ticket.total,
        paymentMethod: ticket.payment_method,
        status: ticket.status,
        isPaid: ticket.is_paid,
        valetQuantity: ticket.valet_quantity,
        createdAt: ticket.created_at,
        deliveredDate: ticket.delivered_date,
        // Mantener los campos originales también
        ...ticket
      };
    });
  } catch (error) {
    console.error('Error al obtener tickets para recoger:', error);
    return [];
  }
};

// Agregamos la función para cancelar tickets
export const cancelTicket = async (ticketId: string, reason: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        is_canceled: true,
        cancel_reason: reason
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw {
        message: `Error al cancelar el ticket: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return {
      success: true,
      message: 'Ticket cancelado correctamente',
      data
    };
  } catch (error) {
    console.error('Error al cancelar el ticket:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};
