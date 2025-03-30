
import { toast as sonnerToast } from 'sonner';

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

  // Custom toast function without using hooks
  custom: (title: string, message: string, type = 'default', duration = 5000) => {
    switch (type) {
      case 'success':
        return sonnerToast.success(title, { description: message, duration });
      case 'error':
        return sonnerToast.error(title, { description: message, duration });
      case 'warning':
        return sonnerToast.warning(title, { description: message, duration });
      case 'info':
        return sonnerToast.info(title, { description: message, duration });
      default:
        return sonnerToast(title, { description: message, duration });
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

// Export a useToast function that returns the toast object without using React hooks
export const useToast = () => {
  return { toast };
};
