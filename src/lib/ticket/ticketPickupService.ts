
import { supabase } from '@/integrations/supabase/client';
import { GenericStringError } from '@/lib/types/error.types';

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
