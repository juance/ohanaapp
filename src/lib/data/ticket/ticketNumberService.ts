
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the next ticket number from the database with improved sequential numbering
 */
export const getNextTicketNumber = async (): Promise<string> => {
  try {
    console.log('Getting next sequential ticket number from database');

    // Use a transaction to ensure sequential numbering
    const { data: result, error } = await supabase.rpc('get_next_sequential_ticket_number');

    if (error) {
      console.error('Error getting next ticket number:', error);
      throw error;
    }

    const ticketNumber = result?.toString().padStart(8, '0') || '00000001';
    console.log('Sequential ticket number generated:', ticketNumber);
    return ticketNumber;
  } catch (error) {
    console.error('Error getting next ticket number:', error);
    
    // Fallback: get the last ticket number and increment
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
      if (lastTicket?.ticket_number) {
        const lastNumber = parseInt(lastTicket.ticket_number, 10);
        nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
      }

      const fallbackNumber = nextNumber.toString().padStart(8, '0');
      console.warn('Using fallback sequential number:', fallbackNumber);
      return fallbackNumber;
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);
      // Ultimate fallback: use timestamp-based number
      const timestamp = Date.now();
      const ultimateFallback = timestamp.toString().slice(-8).padStart(8, '0');
      console.warn('Using ultimate fallback number:', ultimateFallback);
      return ultimateFallback;
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
 * Initialize ticket sequence to ensure it starts properly
 */
export const initializeTicketSequence = async (): Promise<void> => {
  try {
    // Verify sequence exists and initialize if necessary
    const { data: sequenceData, error: sequenceError } = await supabase
      .from('ticket_sequence')
      .select('*')
      .eq('id', 1)
      .single();

    if (sequenceError && sequenceError.code === 'PGRST116') {
      // Sequence doesn't exist, create it
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

/**
 * Set ticket sequence to a specific number
 */
export const setTicketSequence = async (number: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ticket_sequence')
      .upsert({ id: 1, last_number: number })
      .select();

    if (error) throw error;

    console.log(`Ticket sequence set to ${number} successfully`);
    return true;
  } catch (error) {
    console.error('Error setting ticket sequence:', error);
    return false;
  }
};
