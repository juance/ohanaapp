
import { supabase } from '@/integrations/supabase/client';

export interface ErrorContext {
  context?: string;
  action?: string;
  phone?: string;
  component?: string;
  userId?: string;
  [key: string]: any;
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
    
    // Intentar guardar en Supabase
    const { error: dbError } = await supabase
      .from('error_logs')
      .insert(errorLog);
    
    if (dbError) {
      console.error('Error guardando log en base de datos:', dbError);
      // Fallback a localStorage
      const localErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      localErrors.push({
        ...errorLog,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      });
      localStorage.setItem('errorLogs', JSON.stringify(localErrors.slice(-50))); // Mantener solo los últimos 50
    }
    
  } catch (logError) {
    console.error('Error en sistema de logging:', logError);
    // Último recurso: solo console
    console.error('Error original:', error);
    console.error('Contexto:', context);
  }
};

export const getErrorLogs = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching error logs:', error);
      // Fallback a localStorage
      return JSON.parse(localStorage.getItem('errorLogs') || '[]');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getErrorLogs:', error);
    return JSON.parse(localStorage.getItem('errorLogs') || '[]');
  }
};
