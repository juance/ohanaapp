
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
}

export interface ErrorServiceInterface {
  logError: (error: Error | string | unknown, context?: Record<string, any>) => void;
  getErrors: () => Promise<SystemError[]>;
  clearErrors: () => Promise<void>;
  resolveError: (id: string) => Promise<void>;
  deleteError: (id: string) => Promise<void>;
  clearResolvedErrors: () => Promise<void>;
}

export interface GenericStringError {
  message: string;
  status?: number;
  id?: string;
}
