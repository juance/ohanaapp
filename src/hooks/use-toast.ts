
import { toast as sonnerToast } from 'sonner';

// Tipos para nuestro sistema de toast
type ToastProps = {
  title?: string;
  message: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

// Options type for toast functions
type ToastOptions = {
  description?: string;
  duration?: number;
  [key: string]: any;
};

// Implementación simplificada que no usa hooks de React
export const toast = {
  // Implementación básica de toast
  default: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
      // If options is a string, it's the old title parameter
      return sonnerToast(options, {
        description: message,
        duration
      });
    }
    
    return sonnerToast(message, {
      ...(options || {}),
      duration: options?.duration || duration
    });
  },

  // Toast de éxito
  success: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
      // If options is a string, it's the old title parameter
      return sonnerToast.success(options, {
        description: message,
        duration
      });
    }
    
    return sonnerToast.success(message, {
      ...(options || {}),
      duration: options?.duration || duration
    });
  },

  // Toast de error
  error: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
      // If options is a string, it's the old title parameter
      return sonnerToast.error(options, {
        description: message,
        duration
      });
    }
    
    return sonnerToast.error(message, {
      ...(options || {}),
      duration: options?.duration || duration
    });
  },

  // Toast de advertencia
  warning: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
      // If options is a string, it's the old title parameter
      return sonnerToast.warning(options, {
        description: message,
        duration
      });
    }
    
    return sonnerToast.warning(message, {
      ...(options || {}),
      duration: options?.duration || duration
    });
  },

  // Toast informativo
  info: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
      // If options is a string, it's the old title parameter
      return sonnerToast.info(options, {
        description: message,
        duration
      });
    }
    
    return sonnerToast.info(message, {
      ...(options || {}),
      duration: options?.duration || duration
    });
  },

  // Función personalizada que acepta más opciones
  custom: ({ title, message, type = 'default', duration = 5000 }: ToastProps) => {
    switch (type) {
      case 'success':
        return sonnerToast.success(title || message, {
          description: title ? message : undefined,
          duration
        });
      case 'error':
        return sonnerToast.error(title || message, {
          description: title ? message : undefined,
          duration
        });
      case 'warning':
        return sonnerToast.warning(title || message, {
          description: title ? message : undefined,
          duration
        });
      case 'info':
        return sonnerToast.info(title || message, {
          description: title ? message : undefined,
          duration
        });
      default:
        return sonnerToast(title || message, {
          description: title ? message : undefined,
          duration
        });
    }
  },

  // Función de dismiss para compatibilidad con el API anterior
  dismiss: (toastId?: string) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
    } else {
      sonnerToast.dismiss();
    }
  }
};

// Exportamos una función mock de useToast para mantener compatibilidad con código existente
export const useToast = () => {
  return {
    toast,
  };
};
