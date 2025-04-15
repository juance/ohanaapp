
export interface SystemError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context: Record<string, any>;
  resolved: boolean;
  component?: string;
  // Add fields expected by Supabase table
  user_id?: string;
  browser_info?: Record<string, any>;
  error_message?: string;
  error_stack?: string;
  error_context?: Record<string, any>;
}

export interface GenericStringError {
  message: string;
  status?: number;
  id?: string;
}

