
// Re-export toast from use-toast.ts with additional methods 
import { toast as sonnerToast } from 'sonner';

export const toast = {
  // Base toast function
  default: (message: string, options?: any) => sonnerToast(message, options),
  
  // Success toast 
  success: (message: string, options?: any) => sonnerToast.success(message, options),
  
  // Error toast
  error: (message: string, options?: any) => sonnerToast.error(message, options),
  
  // Info toast
  info: (message: string, options?: any) => sonnerToast.info(message, options),
  
  // Warning toast
  warning: (message: string, options?: any) => sonnerToast.warning(message, options),
  
  // Loading toast
  loading: (message: string, options?: any) => sonnerToast.loading(message, options),
  
  // Custom toast with title and description
  custom: (title: string, description?: string, options?: any) => {
    return sonnerToast(title, {
      description,
      ...options
    });
  },
  
  // Alias for default to make it easier to use directly
  (message: string, options?: any) {
    return sonnerToast(message, options);
  }
};

// Make toast callable directly with the signature of the default method
export default toast;
