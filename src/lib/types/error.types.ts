
export interface SystemError {
  id: string;
  message: string;
  error_message?: string; // Para compatibilidad con componentes existentes
  stack?: string;
  error_stack?: string; // Para compatibilidad con componentes existentes
  timestamp: string | Date;
  context?: Record<string, unknown>;
  error_context?: Record<string, unknown>; // Para compatibilidad con componentes existentes
  resolved: boolean;
  component?: string;
  userId?: string;
  user_id?: string; // Para compatibilidad con componentes existentes
  browserInfo?: Record<string, unknown>;
  browser_info?: Record<string, unknown>; // Para compatibilidad con componentes existentes
  level?: ErrorLevel;
  created_at?: string | Date;
}

export enum ErrorLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'error',
  WARNING_LEGACY = 'warning' // Añadido para compatibilidad con errorHandlingService
}

export enum ErrorContext {
  UI = 'ui',
  API = 'api',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  STORAGE = 'storage',
  SYSTEM = 'system',
  UNKNOWN = 'unknown' // Añadido para manejo de casos no definidos
}
