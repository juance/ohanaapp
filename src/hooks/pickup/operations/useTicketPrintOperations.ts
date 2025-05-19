
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';
import { handleTicketPrint as printTicket } from '@/utils/printUtils';
import { getTicketOptions } from '@/lib/ticket/ticketServiceCore';
import { formatTicketData } from '../utils/ticketFormatters';

/**
 * Hook for ticket printing operations
 */
export const useTicketPrintOperations = () => {
  /**
   * Print ticket functionality
   */
  const handlePrintTicket = useCallback(async (ticketId: string): Promise<void> => {
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('*, customers(name, phone)')
        .eq('id', ticketId)
        .single();
      
      if (ticketError) throw ticketError;

      // Get dry cleaning items
      const { data: dryCleaningItems, error: itemsError } = await supabase
        .from('dry_cleaning_items')
        .select('*')
        .eq('ticket_id', ticketId);
      
      if (itemsError) throw itemsError;

      // Get laundry options
      const laundryOptions = await getTicketOptions(ticketId);
      
      // Format the ticket data
      const ticket = formatTicketData(ticketData);

      // Print the ticket
      printTicket(ticket, laundryOptions);
      
    } catch (err: any) {
      console.error("Error printing ticket:", err);
      toast.error(`Error al imprimir ticket: ${err.message}`);
    }
  }, []);

  return { handlePrintTicket };
};
