
// Storage keys for local storage
export const USER_STORAGE_KEY = 'user';
export const TOKEN_STORAGE_KEY = 'token';
export const TICKETS_STORAGE_KEY = 'tickets';
export const PENDING_TICKETS_KEY = 'pendingTickets';
export const DELIVERED_TICKETS_KEY = 'deliveredTickets';
export const CUSTOMERS_STORAGE_KEY = 'customers';
export const SETTINGS_STORAGE_KEY = 'settings';
export const INVENTORY_STORAGE_KEY = 'inventory';
export const METRICS_STORAGE_KEY = 'metrics';
export const EXPENSES_STORAGE_KEY = 'expenses';
export const DASHBOARD_STATS_KEY = 'dashboardStats';
export const FEEDBACK_STORAGE_KEY = 'feedback';
export const SYNC_STATUS_KEY = 'syncStatus';
export const LAST_TICKET_NUMBER_KEY = 'lastTicketNumber';
export const CLIENT_STORAGE_KEY = 'clients';

// Export all keys as a single object for backward compatibility
export const STORAGE_KEYS = {
  USER: USER_STORAGE_KEY,
  TOKEN: TOKEN_STORAGE_KEY,
  TICKETS: TICKETS_STORAGE_KEY,
  PENDING_TICKETS: PENDING_TICKETS_KEY,
  DELIVERED_TICKETS: DELIVERED_TICKETS_KEY,
  CUSTOMERS: CUSTOMERS_STORAGE_KEY,
  SETTINGS: SETTINGS_STORAGE_KEY,
  INVENTORY: INVENTORY_STORAGE_KEY,
  METRICS: METRICS_STORAGE_KEY,
  EXPENSES: EXPENSES_STORAGE_KEY,
  DASHBOARD_STATS: DASHBOARD_STATS_KEY,
  FEEDBACK: FEEDBACK_STORAGE_KEY,
  SYNC_STATUS: SYNC_STATUS_KEY,
  LAST_TICKET_NUMBER: LAST_TICKET_NUMBER_KEY,
  CLIENTS: CLIENT_STORAGE_KEY
};
