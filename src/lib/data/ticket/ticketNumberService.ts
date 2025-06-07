
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the next ticket number from the database
 */
export const getNextTicketNumber = async (): Promise<string> => {
  try {
    console.log('Getting next ticket number from database');

    // Usar transacción para evitar problemas de concurrencia
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
    
    // Fallback más robusto: usar timestamp como último recurso
    const timestamp = Date.now();
    const fallbackNumber = timestamp.toString().slice(-8).padStart(8, '0');
    console.warn('Using timestamp-based fallback number:', fallbackNumber);
    return fallbackNumber;
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
    // Verificar si la secuencia existe y inicializarla si es necesario
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
    } else if (sequenceData) {
      console.log('Ticket sequence already exists with last_number:', sequenceData.last_number);
    }
  } catch (error) {
    console.error('Error checking/initializing ticket sequence:', error);
  }
};
