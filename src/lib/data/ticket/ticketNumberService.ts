
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the next ticket number from the database
 */
export const getNextTicketNumber = async (): Promise<string> => {
  try {
    console.log('Getting next ticket number from database');

    // Llamar a la función de la base de datos para obtener el siguiente número de ticket
    const { data: ticketNumber, error: ticketNumberError } = await supabase
      .rpc('get_next_ticket_number');

    if (ticketNumberError) {
      console.error('Error getting next ticket number:', ticketNumberError);
      throw ticketNumberError;
    }

    console.log('Ticket number generated successfully:', ticketNumber);
    return ticketNumber;
  } catch (error) {
    console.error('Error getting next ticket number:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    
    // Fallback: obtener el último número usado y generar el siguiente
    try {
      const { data: lastTicket, error: lastTicketError } = await supabase
        .from('tickets')
        .select('ticket_number')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastTicketError && lastTicketError.code !== 'PGRST116') {
        throw lastTicketError;
      }

      let nextNumber = 1;
      if (lastTicket && lastTicket.ticket_number) {
        const lastNumber = parseInt(lastTicket.ticket_number);
        nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
      }

      return nextNumber.toString().padStart(8, '0');
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      // Último recurso: generar un número basado en timestamp
      const timestamp = Date.now();
      return timestamp.toString().slice(-8).padStart(8, '0');
    }
  }
};

/**
 * Reset the ticket numbering sequence to start from 1
 */
export const resetTicketNumbering = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('reset_ticket_sequence');

    if (error) throw error;

    console.log('Ticket numbering reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting ticket numbering:', error);
    return false;
  }
};

/**
 * Ensure ticket sequence is initialized
 */
export const initializeTicketSequence = async (): Promise<void> => {
  try {
    // Verificar si la secuencia existe
    const { data: sequenceData, error: sequenceError } = await supabase
      .from('ticket_sequence')
      .select('*')
      .eq('id', 1)
      .single();

    if (sequenceError && sequenceError.code === 'PGRST116') {
      // No existe, crear la secuencia
      const { error: insertError } = await supabase
        .from('ticket_sequence')
        .insert({ id: 1, last_number: 0 });

      if (insertError) {
        console.error('Error initializing ticket sequence:', insertError);
      } else {
        console.log('Ticket sequence initialized successfully');
      }
    }
  } catch (error) {
    console.error('Error checking/initializing ticket sequence:', error);
  }
};
