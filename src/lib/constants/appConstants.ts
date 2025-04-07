
/**
 * Application-wide constants
 */

// Ticket statuses
export const TICKET_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready', 
  DELIVERED: 'delivered'
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  DEBIT: 'debit', 
  MERCADO_PAGO: 'mercadopago',
  CUENTA_DNI: 'cuenta_dni'
} as const;

// Laundry options
export const LAUNDRY_OPTIONS = {
  SEPARATE_COLOR: 'separate_by_color',
  DELICATE_DRY: 'delicate_dry',
  STAIN_REMOVAL: 'stain_removal',
  BLEACH: 'bleach',
  NO_FRAGRANCE: 'no_fragrance',
  NO_DRY: 'no_dry'
} as const;

// Form validation
export const VALIDATION = {
  MIN_PHONE_LENGTH: 8,
  MIN_NAME_LENGTH: 3
} as const;

// Data storage keys
export const STORAGE_KEYS = {
  TICKETS: 'ohana_tickets',
  CUSTOMERS: 'ohana_customers',
  SETTINGS: 'ohana_settings',
  USER_PREFERENCES: 'ohana_preferences'
} as const;

// UI Constants
export const UI = {
  PAGINATION_SIZE: 10,
  TOAST_DURATION: 5000,
  MAX_TABLE_ITEMS: 50
} as const;

// API endpoints (for reference)
export const API_ENDPOINTS = {
  TICKETS: '/tickets',
  CUSTOMERS: '/customers',
  INVENTORY: '/inventory',
  SETTINGS: '/settings'
} as const;
