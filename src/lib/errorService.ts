
import { toast } from "@/lib/toast";
import { supabase } from '@/integrations/supabase/client';

// Define la estructura de un error en el sistema
export interface SystemError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, any>;
  resolved: boolean;
  component?: string;
  user_id?: string;
  browser_info?: string;
}

// Almacenamiento local de errores (para esta implementación)
// Usamos localStorage para persistencia entre sesiones
let errorStore: SystemError[] = [];

// Cargar errores almacenados en localStorage al iniciar
const loadErrorsFromStorage = (): void => {
  try {
    const storedErrors = localStorage.getItem('system_errors');
    if (storedErrors) {
      errorStore = JSON.parse(storedErrors);
    }
  } catch (e) {
    console.error('Error loading errors from storage:', e);
    // Si hay error al cargar, inicializar con array vacío
    errorStore = [];
  }
};

// Guardar errores en localStorage
const saveErrorsToStorage = (): void => {
  try {
    localStorage.setItem('system_errors', JSON.stringify(errorStore));
  } catch (e) {
    console.error('Error saving errors to storage:', e);
  }
};

// Genera un ID único para cada error
const generateErrorId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Inicializar el servicio
export const initErrorService = (): void => {
  loadErrorsFromStorage();
  setupGlobalErrorHandling();
};

// Registra un nuevo error en el sistema
export const logError = async (
  error: Error | string,
  context?: Record<string, any>
): Promise<SystemError> => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  // Obtener información del navegador
  const browserInfo = typeof navigator !== 'undefined' ? {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform
  } : undefined;

  // Obtener ID de usuario si está disponible
  let userId = undefined;
  try {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    userId = user?.id;
  } catch (e) {
    console.error('Error getting user ID:', e);
  }

  const systemError: SystemError = {
    id: generateErrorId(),
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date(),
    context,
    resolved: false,
    user_id: userId,
    browser_info: browserInfo ? JSON.stringify(browserInfo) : undefined,
    component: context?.component
  };

  console.error("Error logged:", systemError);

  // Guardar en el store local
  errorStore = [systemError, ...errorStore];
  saveErrorsToStorage();

  // Intentar guardar en Supabase si está disponible
  try {
    await supabase.from('error_logs').insert({
      error_message: errorMessage,
      error_stack: errorStack,
      error_context: context,
      user_id: userId,
      browser_info: browserInfo,
      component: context?.component
    });
  } catch (e) {
    console.error('Error saving to Supabase:', e);
    // Continuar aunque falle Supabase
  }

  // Notificar al usuario solo para errores críticos
  if (context?.notify !== false) {
    toast({
      variant: "destructive",
      title: "Error detectado",
      description: "Se ha registrado un error en el sistema."
    });
  }

  return systemError;
};

// Obtiene todos los errores registrados
export const getErrors = async (): Promise<SystemError[]> => {
  try {
    // Intentar obtener errores de Supabase primero
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convertir los errores de Supabase al formato SystemError
    const supabaseErrors: SystemError[] = data.map(item => ({
      id: item.id,
      message: item.error_message,
      stack: item.error_stack,
      timestamp: new Date(item.created_at),
      context: item.error_context,
      resolved: item.resolved || false,
      user_id: item.user_id,
      browser_info: item.browser_info,
      component: item.component
    }));

    // Combinar con errores locales
    const combinedErrors = [...supabaseErrors, ...errorStore];

    // Eliminar duplicados basados en ID
    const uniqueErrors = combinedErrors.filter((error, index, self) =>
      index === self.findIndex(e => e.id === error.id)
    );

    // Ordenar por timestamp (más reciente primero)
    return uniqueErrors.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (e) {
    console.error('Error fetching from Supabase, returning local errors:', e);
    // Si falla Supabase, devolver solo errores locales
    return [...errorStore];
  }
};

// Limpiar todos los errores
export const clearErrors = async (): Promise<void> => {
  try {
    // Limpiar en Supabase
    await supabase.from('error_logs').delete().gte('id', 0);
  } catch (e) {
    console.error('Error clearing errors from Supabase:', e);
  }

  // Limpiar localmente
  errorStore = [];
  saveErrorsToStorage();
};

// Marca un error como resuelto
export const resolveError = async (errorId: string): Promise<boolean> => {
  try {
    // Intentar resolver en Supabase
    await supabase
      .from('error_logs')
      .update({ resolved: true })
      .eq('id', errorId);
  } catch (e) {
    console.error('Error resolving error in Supabase:', e);
  }

  // Resolver localmente
  const errorIndex = errorStore.findIndex(e => e.id === errorId);
  if (errorIndex !== -1) {
    errorStore[errorIndex].resolved = true;
    saveErrorsToStorage();
    return true;
  }
  return false;
};

// Elimina un error del registro
export const deleteError = async (errorId: string): Promise<boolean> => {
  try {
    // Intentar eliminar de Supabase
    await supabase
      .from('error_logs')
      .delete()
      .eq('id', errorId);
  } catch (e) {
    console.error('Error deleting error from Supabase:', e);
  }

  // Eliminar localmente
  const initialLength = errorStore.length;
  errorStore = errorStore.filter(e => e.id !== errorId);
  saveErrorsToStorage();
  return errorStore.length < initialLength;
};

// Limpia todos los errores resueltos
export const clearResolvedErrors = async (): Promise<number> => {
  try {
    // Limpiar en Supabase
    await supabase
      .from('error_logs')
      .delete()
      .eq('resolved', true);
  } catch (e) {
    console.error('Error clearing resolved errors from Supabase:', e);
  }

  // Limpiar localmente
  const initialLength = errorStore.length;
  errorStore = errorStore.filter(e => !e.resolved);
  saveErrorsToStorage();
  return initialLength - errorStore.length;
};

// Registra los errores no capturados de la aplicación
export const setupGlobalErrorHandling = (): void => {
  if (typeof window !== 'undefined') {
    // Captura errores no manejados
    window.addEventListener('error', (event) => {
      logError(event.error || new Error(event.message), {
        type: 'uncaught',
        location: window.location.href,
        component: getComponentFromStack(event.error?.stack),
        notify: false // No notificar al usuario para evitar spam
      });
    });

    // Captura promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

      logError(error, {
        type: 'unhandledRejection',
        location: window.location.href,
        component: getComponentFromStack(error.stack),
        notify: false // No notificar al usuario para evitar spam
      });
    });

    console.info("Sistema de registro de errores global inicializado");
  }
};

// Intenta extraer el nombre del componente desde el stack trace
const getComponentFromStack = (stack?: string): string | undefined => {
  if (!stack) return undefined;

  // Buscar patrones como "at ComponentName (" o "at ComponentName.method ("
  const componentMatch = stack.match(/at\s+([A-Z][a-zA-Z0-9]+)(\.|\s|\()/m);
  if (componentMatch && componentMatch[1]) {
    return componentMatch[1];
  }

  return undefined;
};
