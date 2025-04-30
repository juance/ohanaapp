
// Import necessary modules
import { supabase } from '@/integrations/supabase/client';
import { ErrorLevel, ErrorContext } from '@/lib/types';

// Interface for error reporting
interface ErrorReport {
  message: string;
  stack?: string;
  context?: ErrorContext;
  level?: ErrorLevel;
  component?: string;
}

/**
 * Log an error to the console and optionally to a backend service
 * @param error The error object or message to log
 * @param context Additional context for the error
 */
export const logError = (error: Error | string, context?: ErrorContext): void => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error !== 'string' ? error.stack : undefined;
  
  console.error('Error:', errorMessage);
  if (errorStack) {
    console.error('Stack:', errorStack);
  }
  
  // Log to backend if available
  try {
    reportErrorToServer({
      message: errorMessage,
      stack: errorStack,
      context: context || {}
    });
  } catch (e) {
    console.error('Failed to report error to server:', e);
  }
};

/**
 * Report an error to the server for logging
 * @param report Error report containing message and optional stack trace
 */
export const reportErrorToServer = async (report: ErrorReport): Promise<void> => {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Dev mode: Error would be reported to server:', report);
      return;
    }
    
    // Only send to server if we're in production
    const { error } = await supabase.from('error_logs').insert({
      error_message: report.message,
      error_stack: report.stack,
      error_context: report.context,
      component: report.component,
      browser_info: getBrowserInfo()
    });
    
    if (error) {
      console.error('Error storing error log:', error);
    }
  } catch (e) {
    console.error('Failed to report error:', e);
  }
};

/**
 * Get browser information for error reporting
 */
const getBrowserInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
};

// Export other utility functions
export const createErrorHandler = (component: string) => (error: Error | string) => {
  logError(error, { component });
};
