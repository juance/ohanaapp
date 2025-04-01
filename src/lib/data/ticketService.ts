
// Re-export ticket services from their respective files
export { getNextTicketNumber } from './ticket/ticketNumberService';
export { storeTicketData } from './ticket/ticketStorageService';
export { getStoredTickets, getPickupTickets, getDeliveredTickets, getTicketServices } from './ticket/ticketRetrievalService';
export { markTicketAsDelivered, cancelTicket } from './ticket/ticketStatusService';
