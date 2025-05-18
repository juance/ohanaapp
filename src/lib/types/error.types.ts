
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
  id: string;
  message: string;
  error_message?: string; // Added for backward compatibility
  level: ErrorLevel;
  stack?: string;
  error_stack?: string; // Added for backward compatibility
  context?: ErrorContext;
  error_context?: any; // Added for backward compatibility
  resolved?: boolean;
  createdAt?: string;
  updatedAt?: string;
  timestamp?: string; // Added for backward compatibility
  user_id?: string; // Added for backward compatibility
  component?: string; // Added for backward compatibility
  browser_info?: any; // Added for backward compatibility
}
