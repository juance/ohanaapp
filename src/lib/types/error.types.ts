
export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorContext {
  route?: string;
  user?: string;
  action?: string;
  data?: any;
}

export interface SystemError {
  id?: string;
  message: string;
  level: ErrorLevel;
  timestamp: string;
  context?: ErrorContext;
  stack?: string;
  resolved?: boolean;
  // Adding properties that are referenced in components
  error_message?: string;
  error_context?: any;
  error_stack?: string;
  component?: string;
  user_id?: string;
  browser_info?: {
    userAgent?: string;
    platform?: string;
  };
}
