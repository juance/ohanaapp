
import { supabase } from '@/integrations/supabase/client';

export interface ErrorContext {
  context?: string;
  action?: string;
  phone?: string;
  component?: string;
  userId?: string;
  [key: string]: any;
}

export interface SystemError {
  id: string;
  error_message: string;
  error_stack?: string;
  timestamp: string;
  error_context?: Record<string, any>;
  resolved: boolean;
  component?: string;
  user_id?: string;
  browser_info?: Record<string, any>;
  created_at?: string;
}

export const logError = async (
  error: Error, 
  context: ErrorContext = {}
): Promise<void> => {
  try {
    const errorLog = {
      error_message: error.message,
      error_stack: error.stack || '',
      component: context.component || 'unknown',
      error_context: {
        ...context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      },
      user_id: context.userId || null,
      browser_info: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      }
    };
    
    const { error: dbError } = await supabase
      .from('error_logs')
      .insert(errorLog);
    
    if (dbError) {
      console.error('Error guardando log en base de datos:', dbError);
      const localErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      localErrors.push({
        ...errorLog,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      });
      localStorage.setItem('errorLogs', JSON.stringify(localErrors.slice(-50)));
    }
    
  } catch (logError) {
    console.error('Error en sistema de logging:', logError);
    console.error('Error original:', error);
    console.error('Contexto:', context);
  }
};

export const getErrorLogs = async (): Promise<SystemError[]> => {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching error logs:', error);
      return JSON.parse(localStorage.getItem('errorLogs') || '[]');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getErrorLogs:', error);
    return JSON.parse(localStorage.getItem('errorLogs') || '[]');
  }
};

export const getErrors = async (): Promise<SystemError[]> => {
  return getErrorLogs();
};

export const resolveError = async (errorId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .update({ resolved: true })
      .eq('id', errorId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error resolving error:', error);
    throw error;
  }
};

export const deleteError = async (errorId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .eq('id', errorId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting error:', error);
    throw error;
  }
};

export const clearErrors = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (error) {
      throw error;
    }
    
    localStorage.removeItem('errorLogs');
  } catch (error) {
    console.error('Error clearing errors:', error);
    throw error;
  }
};

export const clearResolvedErrors = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .eq('resolved', true);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error clearing resolved errors:', error);
    throw error;
  }
};

export const initErrorService = (): void => {
  console.log('Error service initialized');
};
