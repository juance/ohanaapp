
// Re-export all ticket-related services from the modular files

export { 
  getTicketOptions,
  cancelTicket,
  markTicketAsPaidInAdvance
} from './ticket/ticketServiceCore';

export {
  getPickupTickets,
  markTicketAsDelivered,
  markTicketAsPending,
  getUnretrievedTickets
} from './ticket/ticketPickupService';

export {
  getDeliveredTickets
} from './ticket/ticketDeliveryService';

export {
  getPendingTickets
} from './ticket/ticketPendingService';

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
  moveToNextStatus,
  getNextStatus
} from './ticket/ticketStatusTransitionService';

// Export the ticket service function directly from this file
export { getTicketServices } from './ticket/ticketServiceCore';
