
import { supabase } from '@/integrations/supabase/client';
import { SystemError } from '@/lib/types';

/**
 * Log an error to the database
 */
export const logError = async (
  error: Error | unknown,
  context: Record<string, any> = {}
): Promise<void> => {
  try {
    const errorData: SystemError = {
      id: crypto.randomUUID(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
      context: context,
      resolved: false,
      component: context.component
    };

    const { error: dbError } = await supabase
      .from('error_logs')
      .insert({
        id: errorData.id,
        error_message: errorData.message,
        error_stack: errorData.stack,
        error_context: errorData.context,
        resolved: errorData.resolved,
        component: errorData.component
      });

    if (dbError) {
      console.error('Failed to log error to database:', dbError);
    }
  } catch (loggingError) {
    console.error('Error in error logging service:', loggingError);
  }
};

/**
 * Get all error logs from the database
 */
export const getErrors = async (): Promise<SystemError[]> => {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      message: item.error_message,
      stack: item.error_stack,
      timestamp: new Date(item.created_at),
      context: item.error_context || {},
      resolved: item.resolved,
      component: item.component
    }));
  } catch (error) {
    console.error('Error fetching error logs:', error);
    return [];
  }
};

/**
 * Mark an error as resolved
 */
export const resolveError = async (errorId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .update({ resolved: true })
      .eq('id', errorId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error resolving error log:', error);
    return false;
  }
};

/**
 * Delete an error from the database
 */
export const deleteError = async (errorId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .eq('id', errorId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting error log:', error);
    return false;
  }
};

/**
 * Clear all resolved errors
 */
export const clearResolvedErrors = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .delete()
      .eq('resolved', true)
      .select('id');

    if (error) throw error;
    return data?.length || 0;
  } catch (error) {
    console.error('Error clearing resolved errors:', error);
    return 0;
  }
};

/**
 * Clear all errors
 */
export const clearErrors = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .neq('id', 'none'); // This will match all rows

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing all errors:', error);
    return false;
  }
};

/**
 * Initialize error service
 */
export const initErrorService = (): void => {
  console.log('Error service initialized');
  // This function can be expanded to set up global error handling
};

/**
 * Set up global error handling
 */
export const setupGlobalErrorHandling = (): void => {
  window.addEventListener('error', (event) => {
    logError(event.error, {
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, {
      type: 'unhandled-rejection'
    });
  });
};

// Re-export the SystemError type to make it available to importers
export type { SystemError } from '@/lib/types';

