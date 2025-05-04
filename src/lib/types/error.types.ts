
export enum ErrorLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export enum ErrorContext {
  UI = 'UI',
  API = 'API',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  STORAGE = 'STORAGE',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  UNKNOWN = 'UNKNOWN'
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
  message?: string; // For compatibility
}

export enum ExpenseCategory {
  SUPPLIES = 'supplies',
  MAINTENANCE = 'maintenance',
  UTILITIES = 'utilities',
  SALARY = 'salary',
  RENT = 'rent',
  OTHER = 'other'
}
