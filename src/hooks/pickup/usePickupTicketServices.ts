
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TicketService } from '@/lib/types';
import { toast } from '@/lib/toast';

// Types for the hook
interface TicketServiceWithDetails extends TicketService {
  services: any | null;
}

/**
 * Hook for managing ticket services
 */
export const usePickupTicketServices = () => {
  // State for ticket services
  const [ticketServices, setTicketServices] = useState<TicketServiceWithDetails[]>([]);

  /**
   * Handles errors in a consistent way
   */
  const handleError = useCallback((err: any): void => {
    console.error("Error in usePickupTicketServices:", err);
    toast.error(`Error: ${err.message || 'Ha ocurrido un error inesperado'}`);
  }, []);

  /**
   * Loads the services associated with a ticket
   */
  const loadTicketServices = useCallback(async (ticketId: string): Promise<void> => {
    try {
      // Get dry cleaning items
      const { data: dryCleaningItems, error: dryCleaningError } = await supabase
        .from('dry_cleaning_items')
        .select('*')
        .eq('ticket_id', ticketId);

      if (dryCleaningError) {
        console.error('Error loading dry cleaning items:', dryCleaningError);
        handleError(dryCleaningError);
        setTicketServices([]);
        return;
      }

      // Get laundry options
      const { data: laundryOptions, error: laundryError } = await supabase
        .from('ticket_laundry_options')
        .select('*')
        .eq('ticket_id', ticketId);

      if (laundryError) {
        console.error('Error loading laundry options:', laundryError);
        handleError(laundryError);
        setTicketServices([]);
        return;
      }

      // Combine data from both tables
      const combinedServices = [
        ...(dryCleaningItems || []).map(item => ({
          id: item.id,
          ticket_id: item.ticket_id,
          name: item.name,
          price: item.price || 0,
          quantity: item.quantity || 1,
          type: 'dry_cleaning',
          services: item
        })),
        ...(laundryOptions || []).map(option => ({
          id: option.id,
          ticket_id: option.ticket_id,
          name: option.option_type,
          price: 0, // Laundry options don't have a price
          quantity: 1,
          type: 'laundry_option',
          services: option
        }))
      ] as TicketServiceWithDetails[];

      setTicketServices(combinedServices);
    } catch (err: any) {
      console.error('Error loading ticket services:', err);
      handleError(err);
      setTicketServices([]);
    }
  }, [handleError]);

  return {
    ticketServices,
    loadTicketServices
  };
};

// Export the type so it can be used elsewhere
export type { TicketServiceWithDetails };
