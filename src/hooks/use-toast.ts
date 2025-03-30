
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

// Simplified implementation that uses Sonner directly
export const toast = {
  default: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
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

  success: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
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

  error: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
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

  warning: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
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

  info: (message: string, options?: ToastOptions | string, duration: number = 5000) => {
    if (typeof options === 'string') {
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

  dismiss: (toastId?: string) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
    } else {
      sonnerToast.dismiss();
    }
  }
};

// Export a mock useToast function for compatibility with existing code
export const useToast = () => {
  return {
    toast,
  };
};
