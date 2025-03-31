
// Direct import of sonner toast
import { toast as sonnerToast } from "sonner";

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  description?: string;
  duration?: number;
}

// Create a toast implementation using sonner without React hooks
// This is a simple wrapper around sonner's toast functions
export const toast = {
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

// The useToast hook is maintained for backward compatibility with shadcn/ui
export const useToast = () => {
  return {
    toast,
    // For compatibility with components expecting the old API
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
