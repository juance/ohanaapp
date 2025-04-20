
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
    // Fallback: generate a random number if DB function fails
    const randomNum = Math.floor(Math.random() * 100000000);
    return randomNum.toString().padStart(8, '0');
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
