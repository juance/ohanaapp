
import { supabase } from '@/integrations/supabase/client';
import { SystemError } from './types';

// Define error levels enum
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export async function logError(
  error: Error | string,
  context: Record<string, any> = {}
): Promise<string | null> {
  try {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Error logged:', errorMessage, context);
    
    // Create the error object
    const errorLog: SystemError = {
      id: crypto.randomUUID(),
      message: errorMessage,
      error_message: errorMessage,
      error_stack: errorStack || '',
      timestamp: new Date(),
      error_context: {
        ...context,
        userAgent: navigator.userAgent,
        url: window.location.href
      },
      resolved: false
    };
    
    // Try to insert in database if online
    if (navigator.onLine) {
      try {
        const { data, error: dbError } = await supabase
          .from('error_logs')
          .insert({
            error_message: errorMessage,
            error_stack: errorStack,
            error_context: errorLog.error_context,
            component: context.component || context.context || null
          })
          .select('id')
          .single();
        
        if (dbError) {
          console.error('Failed to save error to database:', dbError);
        } else if (data) {
          return data.id;
        }
      } catch (dbError) {
        console.error('Exception saving error to database:', dbError);
      }
    }
    
    // Save to local storage as fallback
    const existingErrors = JSON.parse(localStorage.getItem('error_logs') || '[]');
    existingErrors.push(errorLog);
    localStorage.setItem('error_logs', JSON.stringify(existingErrors.slice(-50)));  // Keep only last 50 errors
    
    return errorLog.id;
  } catch (e) {
    console.error('Error in logError function:', e);
    return null;
  }
}

export function clearErrors() {
  localStorage.setItem('error_logs', '[]');
}

export async function getErrors(): Promise<SystemError[]> {
  const localErrors = JSON.parse(localStorage.getItem('error_logs') || '[]');
  
  if (navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching errors from DB:', error);
        return localErrors;
      }
      
      // Combine and deduplicate errors
      const mappedDbErrors = data.map(dbError => ({
        id: dbError.id,
        message: dbError.error_message,
        error_message: dbError.error_message,
        error_stack: dbError.error_stack || '',
        timestamp: new Date(dbError.created_at),
        error_context: dbError.error_context || {},
        resolved: dbError.resolved
      }));
      
      return [...mappedDbErrors, ...localErrors.filter(localErr => 
        !mappedDbErrors.some(dbErr => dbErr.id === localErr.id)
      )];
    } catch (e) {
      console.error('Exception fetching errors:', e);
      return localErrors;
    }
  }
  
  return localErrors;
}
