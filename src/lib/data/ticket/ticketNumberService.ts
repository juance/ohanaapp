
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the next ticket number from the database
 */
export const getNextTicketNumber = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .rpc('get_next_ticket_number');
      
    if (error) throw error;
    
    // Ensure the format is always 8 digits with leading zeros (e.g., 00000001)
    const formattedNumber = data.toString().padStart(8, '0');
    console.log('Ticket number generated:', formattedNumber);
    return formattedNumber;
  } catch (error) {
    console.error('Error getting next ticket number:', error);
    // Fallback: generate a random number if DB function fails
    const randomNum = Math.floor(Math.random() * 100000000);
    return randomNum.toString().padStart(8, '0');
  }
};
