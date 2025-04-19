
// Re-export all ticket-related services from the modular files

export {
  getTicketOptions,
  // cancelTicket, // Comentado para evitar conflicto con ticketPickupService
  markTicketAsPaidInAdvance
} from './ticket/ticketServiceCore';

export {
  getPickupTickets,
  markTicketAsDelivered,
  markTicketAsPending,
  getUnretrievedTickets,
  cancelTicket, // Añadido explícitamente desde ticketPickupService
  updateTicketPaymentMethod, // Añadido para permitir cambiar el método de pago
  getRecentTickets
} from './ticket/ticketPickupService';

export {
  getDeliveredTickets
} from './ticket/ticketDeliveryService';

export {
  getPendingTickets
} from './ticket/ticketPendingService';

export {
  createTicket
} from './ticket/ticketCreationService';

// Calculate total - add this function
export const calculateTicketTotal = (ticket: any): number => {
  let total = 0;
  
  // Add dry cleaning items
  if (ticket.dryCleaningItems && Array.isArray(ticket.dryCleaningItems)) {
    total += ticket.dryCleaningItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  
  // Add valet service if applicable
  if (ticket.valetQuantity && ticket.valetPrice) {
    total += ticket.valetQuantity * ticket.valetPrice;
  }
  
  return total;
};

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
  moveToNextStatus,
  getNextStatus
} from './ticket/ticketStatusTransitionService';

// Export the ticket service function directly from this file
export { getTicketServices } from './ticket/ticketServiceCore';
