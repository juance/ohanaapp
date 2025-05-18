
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
}
