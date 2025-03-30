
import { toast as sonnerToast } from 'sonner';

// Types for our toast system
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

// Create a wrapper around sonner that doesn't use React hooks
export const toast = {
  default: (message: string, options?: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast(options, {
        description: message
      });
    }
    
    return sonnerToast(message, options);
  },

  success: (message: string, options?: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast.success(options, {
        description: message
      });
    }
    
    return sonnerToast.success(message, options);
  },

  error: (message: string, options?: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast.error(options, {
        description: message
      });
    }
    
    return sonnerToast.error(message, options);
  },

  warning: (message: string, options?: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast.warning(options, {
        description: message
      });
    }
    
    return sonnerToast.warning(message, options);
  },

  info: (message: string, options?: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast.info(options, {
        description: message
      });
    }
    
    return sonnerToast.info(message, options);
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

// Export a useToast function that doesn't use React hooks
export const useToast = () => {
  return { toast };
};
