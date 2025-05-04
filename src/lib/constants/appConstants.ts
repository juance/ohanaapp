
/**
 * Constants for ticket status
 */
export const TICKET_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

/**
 * Constants for payment methods
 */
export const PAYMENT_METHODS = {
  CASH: 'cash',
  DEBIT: 'debit',
  CREDIT: 'credit',
  MERCADO_PAGO: 'mercadopago',
  CUENTA_DNI: 'cuentaDni',
  TRANSFER: 'transfer'
};

/**
 * Constants for ticket types
 */
export const TICKET_TYPE = {
  DRY_CLEANING: 'tintoreria',
  VALET: 'valet'
};

/**
 * Constants for storage keys
 */
export const STORAGE_KEYS = {
  TICKETS: 'tickets',
  CLIENTS: 'clients',
  EXPENSES: 'expenses',
  FEEDBACK: 'feedback',
  METRICS: 'metrics',
  SYNC_STATUS: 'syncStatus',
  USER_PREFERENCES: 'userPreferences',
  SYSTEM_VERSION: 'systemVersion'
};
