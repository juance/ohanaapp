
import { toast } from '@/lib/toast';

/**
 * Generic error handler that logs to console and displays a toast
 * @param error The error object or message
 * @param context Context information about where the error occurred
 * @param userMessage User-friendly message to display
 * @param silent If true, no toast will be shown to the user
 */
export const handleError = (
  error: unknown, 
  context: string, 
  userMessage: string = 'Ha ocurrido un error',
  silent: boolean = false
): void => {
  // Log to console with context
  console.error(`Error in ${context}:`, error);
  
  // Show toast unless silent mode is requested
  if (!silent) {
    toast.error(userMessage);
  }
};

/**
 * Safely execute an async operation with error handling
 * @param operation Function to execute
 * @param context Context information about the operation
 * @param errorMessage User-friendly error message
 * @param fallbackValue Value to return if operation fails
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: string,
  errorMessage: string = 'Ha ocurrido un error',
  fallbackValue: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    handleError(error, context, errorMessage);
    return fallbackValue;
  }
}

/**
 * Log an error to the database for later analysis
 * @param error Error object or message
 * @param context Context of the error
 * @param userId Optional user ID associated with the error
 */
export const logErrorToDatabase = async (
  error: unknown, 
  context: string, 
  userId?: string
): Promise<void> => {
  // This is a placeholder for future implementation
  // We could store errors in Supabase for later analysis
  console.log('Error logged for future database storage:', { error, context, userId });
};
