
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TicketService } from '@/lib/types';
import { toast } from '@/lib/toast';

// Types for the hook
interface TicketServiceWithDetails extends TicketService {
  services: any | null;
  service_type: 'dry_cleaning' | 'laundry_option';
}

/**
 * Hook for managing ticket services
 */
export const usePicketTicketServices = () => {
  // State for ticket services
  const [ticketServices, setTicketServices] = useState<TicketServiceWithDetails[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

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
    if (!ticketId) {
      console.log('No ticket ID provided');
      setTicketServices([]);
      return;
    }

    try {
      setIsLoadingServices(true);
      console.log('Loading services for ticket:', ticketId);

      // Get dry cleaning items with detailed error handling
      const { data: dryCleaningItems, error: dryCleaningError } = await supabase
        .from('dry_cleaning_items')
        .select(`
          id,
          ticket_id,
          name,
          price,
          quantity,
          created_at
        `)
        .eq('ticket_id', ticketId);

      if (dryCleaningError) {
        console.error('Error loading dry cleaning items:', dryCleaningError);
        throw dryCleaningError;
      }

      // Get laundry options with detailed error handling
      const { data: laundryOptions, error: laundryError } = await supabase
        .from('ticket_laundry_options')
        .select(`
          id,
          ticket_id,
          option_type,
          created_at
        `)
        .eq('ticket_id', ticketId);

      if (laundryError) {
        console.error('Error loading laundry options:', laundryError);
        throw laundryError;
      }

      console.log('Loaded dry cleaning items:', dryCleaningItems);
      console.log('Loaded laundry options:', laundryOptions);

      // Transform and combine data from both tables with real data
      const combinedServices: TicketServiceWithDetails[] = [
        ...(dryCleaningItems || []).map(item => ({
          id: item.id,
          ticket_id: item.ticket_id,
          name: item.name || 'Servicio de limpieza',
          price: Number(item.price) || 0,
          quantity: item.quantity || 1,
          service_type: 'dry_cleaning' as const,
          services: {
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
            created_at: item.created_at,
            total: (Number(item.price) || 0) * (item.quantity || 1)
          }
        })),
        ...(laundryOptions || []).map(option => ({
          id: option.id,
          ticket_id: option.ticket_id,
          name: option.option_type || 'Opción de lavandería',
          price: 0, // Laundry options don't have a price
          quantity: 1,
          service_type: 'laundry_option' as const,
          services: {
            id: option.id,
            option_type: option.option_type,
            created_at: option.created_at
          }
        }))
      ];

      console.log('Combined and transformed services:', combinedServices);
      setTicketServices(combinedServices);
    } catch (err: any) {
      console.error('Unexpected error loading ticket services:', err);
      handleError(err);
      setTicketServices([]);
    } finally {
      setIsLoadingServices(false);
    }
  }, [handleError]);

  return {
    ticketServices,
    isLoadingServices,
    loadTicketServices
  };
};

// Export the type so it can be used elsewhere
export type { TicketServiceWithDetails };
