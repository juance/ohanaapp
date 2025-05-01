
// Application constants

// Ticket statuses
export const TICKET_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
  CANCELLED: 'cancelled' // Alternative spelling
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  DEBIT: 'debit',
  MERCADOPAGO: 'mercadopago',
  CUENTA_DNI: 'cuenta_dni'
};

// Storage keys
export const STORAGE_KEYS = {
  TICKETS: 'ticketsData',
  CLIENTS: 'clientsData',
  EXPENSES: 'expensesData',
  FEEDBACK: 'feedbackData',
  METRICS: 'metricsData',
  SYNC_STATUS: 'syncStatus'
};

// App settings
export const APP_SETTINGS = {
  APP_NAME: 'Sistema de Lavandería',
  VERSION: '1.0.0',
  COPYRIGHT: `© ${new Date().getFullYear()} Sistema de Lavandería`
};

// Pricing defaults
export const PRICING = {
  VALET_PRICE: 2000,
  MIN_FREE_VALETS_POINTS: 50
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  USER: 'user'
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'dd/MM/yyyy HH:mm',
  API_DATETIME: 'yyyy-MM-ddTHH:mm:ss'
};
