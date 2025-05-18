
// Error types for system-wide error handling

export type ErrorLevel = 'info' | 'warning' | 'error' | 'fatal';

export interface ErrorContext {
  userId?: string;
  requestUrl?: string;
  action?: string;
  timestamp?: string;
  component?: string;
  additionalData?: Record<string, any>;
}

export interface SystemError {
  id?: string;
  message: string;
  level: ErrorLevel;
  stack?: string;
  context?: ErrorContext;
  resolved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
