
import { supabase } from '@/integrations/supabase/client';
import { DryCleaningItem, Ticket } from '@/lib/types';
import { GenericStringError } from '@/lib/types/error.types';

/**
 * Get services associated with a ticket
 */
export const getTicketServices = async (ticketId: string): Promise<DryCleaningItem[]> => {
  try {
    console.log('Getting services for ticket:', ticketId);

    // Verificar si el ticket existe primero
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('id')
      .eq('id', ticketId)
      .single();

    if (ticketError) {
      console.error('Error retrieving ticket:', ticketError);
      throw new Error(`Ticket ${ticketId} no encontrado`);
    }

    // Obtener los servicios del ticket
    const { data, error } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);

    if (error) {
      console.error('Error retrieving ticket services:', error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} services for ticket ${ticketId}`);

    if (!data || data.length === 0) {
      console.warn(`No services found for ticket ${ticketId}`);

      // Verificar si hay servicios en el campo dry_cleaning_items del ticket
      const { data: ticketWithItems, error: itemsError } = await supabase
        .from('tickets')
        .select('dry_cleaning_items')
        .eq('id', ticketId)
        .single();

      if (itemsError) {
        console.error('Error retrieving ticket items:', itemsError);
      } else if (ticketWithItems?.dry_cleaning_items && Array.isArray(ticketWithItems.dry_cleaning_items)) {
        console.log(`Found ${ticketWithItems.dry_cleaning_items.length} services in ticket JSON field`);

        // Migrar los servicios del campo JSON a la tabla dry_cleaning_items
        try {
          const itemsToInsert = ticketWithItems.dry_cleaning_items.map((item: any) => ({
            ticket_id: ticketId,
            name: item.name,
            quantity: item.quantity || 1,
            price: item.price || 0
          }));

          const { data: insertedItems, error: insertError } = await supabase
            .from('dry_cleaning_items')
            .insert(itemsToInsert)
            .select();

          if (insertError) {
            console.error('Error inserting ticket services:', insertError);
          } else {
            console.log(`Successfully migrated ${insertedItems.length} services to dry_cleaning_items table`);

            // Devolver los servicios recién insertados
            return insertedItems.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              ticketId: item.ticket_id
            }));
          }
        } catch (migrationError) {
          console.error('Error migrating ticket services:', migrationError);
        }

        // Si la migración falla, devolver los servicios del campo JSON
        return ticketWithItems.dry_cleaning_items.map((item: any, index: number) => ({
          id: `temp-${index}`,
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price || 0,
          ticketId: ticketId
        }));
      }
    }

    // Map the data to match the DryCleaningItem type
    return (data || []).map(item => ({
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
