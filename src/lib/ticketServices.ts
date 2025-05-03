
// Re-export all ticket-related services from the new modular files
export {
  getTicketServices,
  getTicketOptions,
  markTicketAsPaidInAdvance
} from './ticket/ticketServiceCore';

// Export the functions from ticketStatusTransitionService
export {
  markTicketAsProcessing,
  markTicketAsReady,
  markTicketAsDelivered,
  markTicketAsPending,
  cancelTicket,
  getNextStatus,
  moveToNextStatus
} from './ticket/ticketStatusTransitionService';

export {
  getDeliveredTickets
} from './ticket/ticketDeliveryService';

// Export functions from ticketPickupService
export {
  getPickupTickets,
  getUnretrievedTickets
} from './ticket/ticketPickupService';

// Re-export query utilities for other modules to use
export {
  checkDeliveredDateColumnExists,
  buildTicketSelectQuery,
  mapTicketData
} from './ticket/ticketQueryUtils';

// Re-export status utilities
export {
  isInStatus,
  getDatabaseStatuses,
  getStatusDisplayName,
  getStatusBadgeClass
} from './ticket/ticketStatusService';
