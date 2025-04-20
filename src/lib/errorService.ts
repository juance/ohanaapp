
import { supabase } from '@/integrations/supabase/client';
import { SystemError } from './types/error.types';
import { v4 as uuidv4 } from 'uuid';
import { ensureSupabaseSession } from '@/lib/auth/supabaseAuth';

export const logError = async (error: Error | string | unknown, context: Record<string, any> = {}) => {
  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const systemError: SystemError = {
      id: uuidv4(),
      error_message: errorMessage,
      error_stack: errorStack,
      timestamp: new Date(),
      error_context: context,
      resolved: false
    };

    // Verificar si hay una sesión activa antes de intentar registrar el error
    const isSessionActive = await ensureSupabaseSession();

    if (isSessionActive) {
      try {
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

        if (insertError) {
          console.warn('Error al insertar en error_logs:', insertError);
        }
      } catch (dbError) {
        console.warn('Error al registrar error en Supabase:', dbError);
      }
    } else {
      console.warn('No se pudo registrar el error en Supabase: No hay sesión activa');
    }

    return systemError;
  } catch (err) {
    console.error('Error logging error:', err);
    return null;
  }
};

export const getErrors = async (): Promise<SystemError[]> => {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match SystemError interface
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
      message: item.error_message // For compatibility
    }));
  } catch (error) {
    console.error('Error fetching errors:', error);
    return [];
  }
};

export const clearErrors = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .neq('id', '');

    if (error) throw error;
  } catch (error) {
    console.error('Error clearing errors:', error);
    throw error;
  }
};

export const resolveError = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .update({ resolved: true })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error resolving error:', error);
    throw error;
  }
};

export const deleteError = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting error:', error);
    throw error;
  }
};

export const clearResolvedErrors = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .eq('resolved', true);

    if (error) throw error;
  } catch (error) {
    console.error('Error clearing resolved errors:', error);
    throw error;
  }
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
export type { SystemError } from './types/error.types';
