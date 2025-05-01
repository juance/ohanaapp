
// Error handling types

export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum ErrorContext {
  UI = 'ui',
  API = 'api',
  DATABASE = 'database',
  SYNC = 'sync',
  AUTHENTICATION = 'authentication',
  UNKNOWN = 'unknown'
}

export interface SystemError {
  id: string;
  error_message: string;
  error_stack?: string;
  timestamp: Date;
  error_context?: Record<string, any>;
  resolved: boolean;
  component?: string;
  user_id?: string;
  browser_info?: Record<string, any>;
  message?: string;
}

// Storage keys for local data
export const EXPENSES_STORAGE_KEY = 'expensesData';
export const FEEDBACK_STORAGE_KEY = 'feedbackData';
export const TICKETS_STORAGE_KEY = 'ticketsData';
