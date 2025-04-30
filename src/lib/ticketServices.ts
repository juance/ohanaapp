
// Re-export all ticket-related services from the new modular files
export {
  getTicketServices,
  getTicketOptions,
  // cancelTicket, // Commented out to avoid conflict with ticketPickupService
  markTicketAsPaidInAdvance
} from './ticket/ticketServiceCore';

// Fix imports by adding the missing functions
export {
  // Add stubs for missing functions
  getPickupTickets,
  markTicketAsDelivered,
  markTicketAsPending,
  getUnretrievedTickets,
  cancelTicket
} from './ticket/ticketServiceCore';

export {
  getDeliveredTickets
} from './ticket/ticketDeliveryService';

// Re-export query utilities for other modules to use
export {
  checkDeliveredDateColumnExists,
  buildTicketSelectQuery,
  mapTicketData
} from './ticket/ticketQueryUtils';
