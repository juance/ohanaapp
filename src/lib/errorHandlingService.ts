
import { ErrorLevel, ErrorContext } from './types/error.types';

interface ErrorData {
  level: ErrorLevel;
  context: ErrorContext;
  message: string;
  details?: any;
  timestamp: string;
}

// Store errors for in-memory logging
const errorLog: ErrorData[] = [];

/**
 * Log an error with contextual information
 */
export const logError = (
  message: string,
  level: ErrorLevel = ErrorLevel.ERROR,
  context: ErrorContext = ErrorContext.UNKNOWN,
  details?: any
): void => {
  // Create error data
  const errorData: ErrorData = {
    level,
    context,
    message,
    details,
    timestamp: new Date().toISOString()
  };

  // Log to console for development
  console.error(`[${errorData.level}] ${errorData.message}`, {
    context: errorData.context,
    details: errorData.details
  });

  // Add to in-memory log
  errorLog.push(errorData);

  // For critical errors, consider additional actions
  if (level === ErrorLevel.CRITICAL) {
    // TODO: Implement critical error handling (e.g., notify admin)
  }
};

/**
 * Handle validation errors during form validation
 */
export const handleValidationError = (
  message: string,
  field?: string,
  value?: any
): void => {
  logError(
    `Validation error: ${message}`,
    ErrorLevel.WARNING,
    ErrorContext.UI,
    { field, value }
  );
};

/**
 * Handle API errors during data fetching
 */
export const handleApiError = (error: any, endpoint?: string): void => {
  let message = 'API request failed';
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  }

  logError(
    message,
    ErrorLevel.ERROR,
    ErrorContext.API,
    { endpoint, error }
  );
};

/**
 * Handle database errors during data operations
 */
export const handleDatabaseError = (error: any, operation?: string): void => {
  logError(
    `Database operation failed: ${operation || 'unknown'}`,
    ErrorLevel.ERROR,
    ErrorContext.DATABASE,
    error
  );
};

/**
 * Handle UI component errors
 */
export const handleComponentError = (error: any, component: string): void => {
  logError(
    `Error in component: ${component}`,
    ErrorLevel.ERROR,
    ErrorContext.UI,
    error
  );
};

/**
 * Get the full error log
 */
export const getErrorLog = (): ErrorData[] => {
  return [...errorLog];
};

/**
 * Clear error log
 */
export const clearErrorLog = (): void => {
  errorLog.length = 0;
};
