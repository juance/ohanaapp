
// Re-export all ticket-related services from the modular files
import { getTicketServices } from './ticketService';

export { 
  getTicketServices,
  getTicketOptions,
  cancelTicket,
  markTicketAsPaidInAdvance
} from './ticketService';

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
