
export interface SystemError {
  id: string;
  message: string;
  error_message?: string; // For backward compatibility
  stack?: string;
  error_stack?: string; // For backward compatibility
  timestamp: string | Date;
  context?: Record<string, unknown>;
  error_context?: Record<string, unknown>; // For backward compatibility
  resolved: boolean;
  component?: string;
  userId?: string;
  user_id?: string; // For backward compatibility
  browserInfo?: Record<string, unknown>;
  browser_info?: Record<string, unknown>; // For backward compatibility
  level?: ErrorLevel;
  created_at?: string | Date;
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
