
import { supabase } from '@/integrations/supabase/client';
import { DryCleaningItem, Ticket } from '@/lib/types';
import { GenericStringError } from '@/lib/types/error.types';

/**
 * Get services associated with a ticket
 */
export const getTicketServices = async (ticketId: string): Promise<DryCleaningItem[]> => {
  try {
    console.log('Getting services for ticket:', ticketId);
    const { data, error } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);

    if (error) {
      console.error('Error retrieving ticket services:', error);
      throw error;
    }

    console.log(`Found ${data.length} services for ticket ${ticketId}`);

    // Map the data to match the DryCleaningItem type
    return data.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      ticketId: item.ticket_id
    }));
  } catch (error) {
    console.error('Error retrieving ticket services:', error);
    return [];
  }
};

/**
 * Get ticket options (this function can be expanded as needed)
 */
export const getTicketOptions = async () => {
  // Implementation
  return [];
};

/**
 * Mark a ticket as paid in advance
 */
export const markTicketAsPaidInAdvance = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        is_paid: true
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw {
        message: `Error updating ticket payment status: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return data;
  } catch (error) {
    console.error('Error marking ticket as paid in advance:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};

/**
 * Cancel a ticket
 */
export const cancelTicket = async (ticketId: string, reason: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        is_canceled: true,
        cancel_reason: reason,
        status: 'canceled'
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
