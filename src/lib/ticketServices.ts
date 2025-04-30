
// Re-export all ticket-related services from the new modular files
export {
  getTicketServices,
  getTicketOptions,
  markTicketAsPaidInAdvance
} from './ticket/ticketServiceCore';

// Export the functions from ticketPickupService
export {
  getPickupTickets,
  markTicketAsDelivered,
  markTicketAsPending,
  getUnretrievedTickets,
  cancelTicket
} from './ticket/ticketPickupService';

export {
  getDeliveredTickets
} from './ticket/ticketDeliveryService';

// Re-export query utilities for other modules to use
export {
  checkDeliveredDateColumnExists,
  buildTicketSelectQuery,
  mapTicketData
} from './ticket/ticketQueryUtils';
