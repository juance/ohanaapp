
import { toast as sonnerToast } from 'sonner';

// Tipos para nuestro sistema de toast
type ToastProps = {
  title?: string;
  message: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

// Implementación simplificada que no usa hooks de React
export const toast = {
  // Implementación básica de toast
  default: (message: string, title?: string, duration: number = 5000) => {
    return sonnerToast(title || message, {
      description: title ? message : undefined,
      duration
    });
  },

  // Toast de éxito
  success: (message: string, title?: string, duration: number = 5000) => {
    return sonnerToast.success(title || message, {
      description: title ? message : undefined,
      duration
    });
  },

  // Toast de error
  error: (message: string, title?: string, duration: number = 5000) => {
    return sonnerToast.error(title || message, {
      description: title ? message : undefined,
      duration
    });
  },

  // Toast de advertencia
  warning: (message: string, title?: string, duration: number = 5000) => {
    return sonnerToast.warning(title || message, {
      description: title ? message : undefined,
      duration
    });
  },

  // Toast informativo
  info: (message: string, title?: string, duration: number = 5000) => {
    return sonnerToast.info(title || message, {
      description: title ? message : undefined,
      duration
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
