
// Import sonner functions
import { toast as sonnerToast } from "sonner";

// Simple interface for basic toast options
type ToastOptions = {
  description?: string;
  duration?: number;
};

// Re-export sonner toast with our simplified interface
const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.message(message, options);
  }
};

// Export the toast functions
export { toast };

// For compatibility with existing code, create a useToast hook that returns the same interface
export const useToast = () => {
  return {
    toast
  };
};
