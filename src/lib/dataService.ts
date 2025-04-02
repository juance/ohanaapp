
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
} from './data/ticketService';

// Export sync service
export {
  syncOfflineData
} from './data/syncService';

// Export customer service
export * from './data/customerService';

// Export client service
export {
  getClientVisitFrequency
} from './data/clientService';

// Export metrics service
export {
  getDailyMetrics,
  getWeeklyMetrics,
  getMonthlyMetrics
} from './data/metricsService';

// Export expense service
export {
  storeExpense,
  getStoredExpenses,
  getDailyExpenses,
  getWeeklyExpenses,
  getMonthlyExpenses
} from './data/expenseService';

// Explicitly export getCustomerByPhone for direct imports
export { getCustomerByPhone } from './data/customerService';
