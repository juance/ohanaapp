
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the next ticket number from the database
 */
export const getNextTicketNumber = async (): Promise<string> => {
  try {
    console.log('Getting next ticket number from database');

    // Alternativa: Actualizar directamente la tabla ticket_sequence
    const { data: sequenceData, error: sequenceError } = await supabase
      .from('ticket_sequence')
      .select('last_number')
      .eq('id', 1)
      .single();

    if (sequenceError) {
      console.error('Error getting ticket sequence:', sequenceError);
      throw sequenceError;
    }

    console.log('Current sequence value:', sequenceData.last_number);

    // Incrementar el número
    const nextNumber = (sequenceData.last_number || 0) + 1;

    // Actualizar la secuencia
    const { error: updateError } = await supabase
      .from('ticket_sequence')
      .update({ last_number: nextNumber })
      .eq('id', 1);

    if (updateError) {
      console.error('Error updating ticket sequence:', updateError);
      throw updateError;
    }

    // Formatear el número con ceros a la izquierda (8 dígitos)
    const formattedNumber = nextNumber.toString().padStart(8, '0');
    console.log('Ticket number generated successfully:', formattedNumber);
    return formattedNumber;
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
