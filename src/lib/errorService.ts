
import { supabase } from '@/integrations/supabase/client';
import { SystemError } from './types/error.types';

export const logError = async (error: Error | string | unknown, context: Record<string, any> = {}) => {
  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const systemError: SystemError = {
      error_message: errorMessage,
      error_stack: errorStack,
      timestamp: new Date(),
      error_context: context,
      resolved: false,
      id: crypto.randomUUID()
    };

    const { error: insertError } = await supabase
      .from('error_logs')
      .insert({
        error_message: systemError.error_message,
        error_stack: systemError.error_stack,
        error_context: systemError.error_context,
        resolved: systemError.resolved,
        id: systemError.id,
        browser_info: getBrowserInfo()
      });

    if (insertError) throw insertError;
  } catch (err) {
    console.error('Error logging error:', err);
  }
};

export const getErrors = async (): Promise<SystemError[]> => {
  const { data, error } = await supabase
    .from('error_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SystemError[];
};

export const clearErrors = async (): Promise<void> => {
  const { error } = await supabase
    .from('error_logs')
    .delete()
    .neq('id', '');

  if (error) throw error;
};

export const resolveError = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('error_logs')
    .update({ resolved: true })
    .eq('id', id);

  if (error) throw error;
};

export const deleteError = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('error_logs')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const clearResolvedErrors = async (): Promise<void> => {
  const { error } = await supabase
    .from('error_logs')
    .delete()
    .eq('resolved', true);

  if (error) throw error;
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
