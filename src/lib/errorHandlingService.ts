
import { toast } from '@/lib/toast';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'network',
  DATABASE = 'database',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  UNKNOWN = 'unknown'
}

// Error context for better debugging
interface ErrorContext {
  component?: string;
  action?: string;
  data?: any;
  userId?: string;
}

// Central error handling function
export const handleError = (
  error: any, 
  context: ErrorContext = {}, 
  showToast = true,
  logToConsole = true
): void => {
  // Extract error message
  const errorMessage = error?.message || 'An unknown error occurred';
  
  // Determine error type
  const errorType = determineErrorType(error);
  
  // Log to console if enabled
  if (logToConsole) {
    console.error(
      `[ERROR][${errorType}][${context.component || 'unknown'}][${context.action || 'unknown'}]:`, 
      errorMessage, 
      error, 
      context
    );
  }
  
  // Show user-friendly toast notification if enabled
  if (showToast) {
    const userMessage = getUserFriendlyMessage(errorType, errorMessage);
    toast.error('Error', {
      description: userMessage,
    });
  }
  
  // Here you could add additional error handling like:
  // - Logging to a server
  // - Triggering analytics events
  // - Special handling for authentication errors (redirect to login)
};

// Determine the type of error for better handling
const determineErrorType = (error: any): ErrorType => {
  // Network errors
  if (error?.message?.includes('network') || error?.message?.includes('connection') || error?.code === 'NETWORK_ERROR') {
    return ErrorType.NETWORK;
  }
  
  // Database errors
  if (error?.code?.startsWith('PGRST') || error?.message?.includes('database') || error?.code === 'DATABASE_ERROR') {
    return ErrorType.DATABASE;
  }
  
  // Validation errors
  if (error?.message?.includes('validation') || error?.code === 'VALIDATION_ERROR') {
    return ErrorType.VALIDATION;
  }
  
  // Authentication errors
  if (error?.message?.includes('authentication') || error?.message?.includes('auth') || error?.code === 'AUTH_ERROR') {
    return ErrorType.AUTHENTICATION;
  }
  
  // Default to unknown
  return ErrorType.UNKNOWN;
};

// Get user-friendly error message based on error type
const getUserFriendlyMessage = (errorType: ErrorType, originalMessage: string): string => {
  switch (errorType) {
    case ErrorType.NETWORK:
      return 'Problema de conexión a internet. Por favor, verifica tu conexión e inténtalo de nuevo.';
    case ErrorType.DATABASE:
      return 'Error al acceder a la base de datos. Por favor, inténtalo de nuevo más tarde.';
    case ErrorType.VALIDATION:
      return originalMessage.includes('validation') 
        ? originalMessage // Show original if it's already a validation message
        : 'Los datos ingresados no son válidos. Por favor revisa e inténtalo de nuevo.';
    case ErrorType.AUTHENTICATION:
      return 'Error de autenticación. Por favor, inicia sesión de nuevo.';
    case ErrorType.UNKNOWN:
    default:
      return 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
  }
};

// Export a more focused function for network errors
export const handleNetworkError = (error: any, context: ErrorContext = {}): void => {
  handleError(error, { ...context, action: context.action || 'network_operation' }, true, true);
};

// Export a more focused function for database errors
export const handleDatabaseError = (error: any, context: ErrorContext = {}): void => {
  handleError(error, { ...context, action: context.action || 'database_operation' }, true, true);
};

// Export a utility for form validation errors
export const handleValidationError = (errorMessage: string, context: ErrorContext = {}, showToast = true): void => {
  const error = new Error(errorMessage);
  handleError(error, { ...context, action: context.action || 'validation' }, showToast, false);
};
