
// Error-related types

export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface ErrorDetails {
  level: ErrorLevel;
  message: string;
  source: string;
  timestamp: string;
  stackTrace?: string;
  errorCode?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

// Mock expense category for compatibility
export enum ExpenseCategory {
  SUPPLIES = 'supplies',
  UTILITIES = 'utilities',
  RENT = 'rent',
  PAYROLL = 'payroll',
  MAINTENANCE = 'maintenance',
  OTHER = 'other'
}
