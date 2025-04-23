
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
  }
};

// Add function capability to the toast object
const toastFunction = (message: string, options?: any) => {
  return sonnerToast(message, options);
};

// Copy all properties from toast object to the function
Object.assign(toastFunction, toast);

// Export the function with all properties
export default toastFunction as typeof toast & {
  (message: string, options?: any): any;
};
