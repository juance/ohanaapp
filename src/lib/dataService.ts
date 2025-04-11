
// Main data service file - exports all data-related functions

// Export core utilities
export {
  saveToLocalStorage,
  getFromLocalStorage,
  formatPaymentMethod,
  TICKETS_STORAGE_KEY,
  EXPENSES_STORAGE_KEY
} from './data/coreUtils';

// Export ticket services
export {
  getNextTicketNumber
} from './data/ticket/ticketNumberService';

export {
  storeTicket
} from './data/ticket/ticketStorageService';

export {
  getStoredTickets
} from './data/ticket/ticketRetrievalService';

// Export sync service
export {
  syncOfflineData
} from './data/syncService';

// Export sync comprehensive service
export {
  syncAllData,
  getSyncStatus
} from './data/sync/comprehensiveSync';

// Export customer service
export * from './data/customer/customerService';

// Export client service
export {
  getClientVisitFrequency
} from './data/clientService';

// Export metrics service
export {
  getMetrics
} from './data/metricsService';

// Export expense service
export * from './data/expenseService';

// Do not re-export loyalty service since we're exporting all from customerService
// which includes these functions

// Explicitly export getCustomerByPhone for direct imports
export { getCustomerByPhone } from './data/customer/customerRetrievalService';

// Export storeTicket as storeTicketData for backward compatibility
export { storeTicket as storeTicketData } from './data/ticket/ticketStorageService';
