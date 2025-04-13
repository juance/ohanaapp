
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the next ticket number from the database
 */
export const getNextTicketNumber = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .rpc('get_next_ticket_number');

    if (error) throw error;

    // La función ahora devuelve directamente el número formateado como texto
    console.log('Ticket number generated:', data);
    return data;
  } catch (error) {
    console.error('Error getting next ticket number:', error);
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
