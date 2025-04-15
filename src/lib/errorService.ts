
import { supabase } from '@/integrations/supabase/client';
import { SystemError } from './types/error.types';

export const logError = async (error: Error | string | unknown, context: Record<string, any> = {}) => {
  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const systemError: SystemError = {
      id: crypto.randomUUID(),
      error_message: errorMessage,
      error_stack: errorStack,
      timestamp: new Date(),
      error_context: context,
      resolved: false
    };

    const { error: insertError } = await supabase
      .from('error_logs')
      .insert({
        error_message: systemError.error_message,
        error_stack: systemError.error_stack,
        error_context: systemError.error_context,
        resolved: systemError.resolved,
        id: systemError.id,
        browser_info: getBrowserInfo(),
        component: context.component,
        user_id: context.userId
      });

    if (insertError) throw insertError;
    
    return systemError;
  } catch (err) {
    console.error('Error logging error:', err);
    return null;
  }
};

export const getErrors = async (): Promise<SystemError[]> => {
  const { data, error } = await supabase
    .from('error_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Transformar los datos para que coincidan con la interfaz SystemError
  return data.map(item => ({
    id: item.id,
    error_message: item.error_message,
    error_stack: item.error_stack,
    timestamp: new Date(item.created_at),
    error_context: item.error_context,
    resolved: item.resolved,
    component: item.component,
    user_id: item.user_id,
    browser_info: item.browser_info,
    message: item.error_message // Para compatibilidad
  }));
};

export const clearErrors = async (): Promise<void> => {
  const { error } = await supabase
    .from('error_logs')
    .delete()
    .neq('id', '');

  if (error) throw error;
};

export const resolveError = async (id: string): Promise<number> => {
  const { error, count } = await supabase
    .from('error_logs')
    .update({ resolved: true })
    .eq('id', id)
    .select('count');

  if (error) throw error;
  return count || 0;
};

export const deleteError = async (id: string): Promise<number> => {
  const { error, count } = await supabase
    .from('error_logs')
    .delete()
    .eq('id', id)
    .select('count');

  if (error) throw error;
  return count || 0;
};

export const clearResolvedErrors = async (): Promise<number> => {
  const { error, count } = await supabase
    .from('error_logs')
    .delete()
    .eq('resolved', true)
    .select('count');

  if (error) throw error;
  return count || 0;
};

const getBrowserInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform
  };
};

export const setupGlobalErrorHandling = () => {
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    logError(error || msg, {
      url,
      lineNo,
      columnNo
    });
    return false;
  };

  window.onunhandledrejection = (event) => {
    logError(event.reason, {
      type: 'unhandledrejection'
    });
  };
};

export const initErrorService = () => {
  setupGlobalErrorHandling();
};

// Exportamos SystemError para que sea accesible
export { SystemError } from './types/error.types';
