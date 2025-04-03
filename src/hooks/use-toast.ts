
import { toast as originalToast, useToast as useToastContext } from '@/contexts/ToastContext';

// Create a compatible toast interface
const toast = Object.assign(
  (message: string) => originalToast(message),
  {
    success: (title: string, description?: string) => 
      originalToast.success(title, description),
    error: (title: string, description?: string) => 
      originalToast.error(title, description),
    warning: (title: string, description?: string) => 
      originalToast.warning(title, description),
    info: (title: string, description?: string) => 
      originalToast.info(title, description),
  }
);

export { toast };
export const useToast = useToastContext;
