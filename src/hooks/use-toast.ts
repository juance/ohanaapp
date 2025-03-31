
import { toast as sonnerToast } from "sonner";

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  description?: string;
  duration?: number;
}

// Create a proper toast implementation using sonner
const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      duration: options?.duration || 3000,
      description: options?.description,
    });
  },
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      duration: options?.duration || 3000,
      description: options?.description,
    });
  },
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      duration: options?.duration || 3000,
      description: options?.description,
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      duration: options?.duration || 3000,
      description: options?.description,
    });
  },
};

// Export the toast functions
export { toast };

// The useToast hook is maintained for backward compatibility
export const useToast = () => {
  return {
    toasts: [],
    addToast: (message: string, type: ToastType = 'info') => {
      switch (type) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
          toast.error(message);
          break;
        case 'info':
          toast.info(message);
          break;
        case 'warning':
          toast.warning(message);
          break;
      }
    },
    removeToast: () => {
      // This is a no-op since sonner handles this internally
    },
  };
};
