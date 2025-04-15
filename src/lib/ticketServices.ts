
// Re-export all ticket-related services from the new modular files
export { 
  getTicketServices,
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

// Re-export query utilities for other modules to use
export {
  checkDeliveredDateColumnExists,
  buildTicketSelectQuery,
  mapTicketData
} from './ticket/ticketQueryUtils';
