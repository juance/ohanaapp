
export interface SystemError {
  id: string;
  message: string;
  stack?: string;
  timestamp: string;
  context?: Record<string, unknown>;
  resolved: boolean;
  component?: string;
  userId?: string;
  browserInfo?: Record<string, unknown>;
  level: ErrorLevel;
}

export enum ErrorLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorContext {
  UI = 'ui',
  API = 'api',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  STORAGE = 'storage',
  SYSTEM = 'system'
}
