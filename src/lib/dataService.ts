
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
  getNextTicketNumber,
  storeTicketData,
  getStoredTickets
} from './data/ticket/ticketStorageService';

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
export * from './data/customer';

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

// Explicitly export getCustomerByPhone for direct imports
export { getCustomerByPhone } from './data/customer/customerRetrievalService';
