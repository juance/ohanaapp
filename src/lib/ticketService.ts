
// Re-export all ticket-related services from the modular files
import { supabase } from '@/integrations/supabase/client';
import { Ticket, DryCleaningItem } from './types';

// Re-export from ticketServiceCore
export {
  getTicketOptions,
  cancelTicket,
  markTicketAsPaidInAdvance
} from './ticket/ticketServiceCore';

// Re-export from ticketPickupService
export {
  getPickupTickets,
  markTicketAsDelivered,
  getUnretrievedTickets
} from './ticket/ticketPickupService';

// Re-export from ticketDeliveryService
export {
  getDeliveredTickets
} from './ticket/ticketDeliveryService';

// Re-export from ticketPendingService
export {
  getPendingTickets
} from './ticket/ticketPendingService';

// Re-export from ticketCreationService
export {
  createTicket,
  calculateTicketTotal
} from './ticket/ticketCreationService';

// Re-export query utilities for other modules to use
export {
  checkDeliveredDateColumnExists,
  buildTicketSelectQuery,
  mapTicketData
} from './ticket/ticketQueryUtils';

// Re-export status service functions
export {
  mapToSimplifiedStatus,
  mapToDatabaseStatus,
  isInStatus,
  isPending,
  isDelivered,
  getDatabaseStatuses,
  getStatusDisplayName,
  getStatusBadgeClass
} from './ticket/ticketStatusService';

// Re-export status transition service functions
export {
  markTicketAsProcessing,
  markTicketAsReady,
  markTicketAsPending,
  getNextStatus,
  moveToNextStatus
} from './ticket/ticketStatusTransitionService';

/**
 * Get services associated with a ticket
 * This is kept here for backward compatibility
 */
export const getTicketServices = async (ticketId: string): Promise<DryCleaningItem[]> => {
  try {
    console.log('Getting services for ticket:', ticketId);
    const { data, error } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);

    if (error) {
      console.error('Error retrieving ticket services:', error);
      throw error;
    }

    console.log(`Found ${data.length} services for ticket ${ticketId}`);

    // Map the data to match the DryCleaningItem type
    return data.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      ticketId: item.ticket_id
    }));
  } catch (error) {
    console.error('Error retrieving ticket services:', error);
    return [];
  }
};
