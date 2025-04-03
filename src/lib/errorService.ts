
import { toast } from '@/hooks/use-toast';

// Define la estructura de un error en el sistema
export interface SystemError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, any>;
  resolved: boolean;
}

// Almacenamiento local de errores (para esta implementación)
// En una aplicación real, podrías guardar esto en Supabase o localStorage
let errorStore: SystemError[] = [];

// Genera un ID único para cada error
const generateErrorId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Registra un nuevo error en el sistema
export const logError = (
  error: Error | string,
  context?: Record<string, any>
): SystemError => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;
  
  const systemError: SystemError = {
    id: generateErrorId(),
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date(),
    context,
    resolved: false
  };
  
  console.error("Error logged:", systemError);
  errorStore = [systemError, ...errorStore];
  
  // Opcionalmente notificar al usuario
  toast.error("Error detectado", "Se ha registrado un error en el sistema.");
  
  return systemError;
};

// Obtiene todos los errores registrados
export const getErrors = (): SystemError[] => {
  return [...errorStore];
};

// Marca un error como resuelto
export const resolveError = (errorId: string): boolean => {
  const errorIndex = errorStore.findIndex(e => e.id === errorId);
  if (errorIndex !== -1) {
    errorStore[errorIndex].resolved = true;
    return true;
  }
  return false;
};

// Elimina un error del registro
export const deleteError = (errorId: string): boolean => {
  const initialLength = errorStore.length;
  errorStore = errorStore.filter(e => e.id !== errorId);
  return errorStore.length < initialLength;
};

// Limpia todos los errores resueltos
export const clearResolvedErrors = (): number => {
  const initialLength = errorStore.length;
  errorStore = errorStore.filter(e => !e.resolved);
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
        userAgent: navigator.userAgent
      });
    });
    
    // Captura promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      logError(error, {
        type: 'unhandledRejection',
        location: window.location.href
      });
    });
    
    console.info("Sistema de registro de errores global inicializado");
  }
};
