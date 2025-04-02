
// Re-export the toast function from sonner with proper TypeScript types
import { toast as sonnerToast } from 'sonner';

type ToastProps = Parameters<typeof sonnerToast>[1];

export const toast = {
  // Main toast function
  ...sonnerToast,
  
  // Helper methods with proper typing
  success: (title: string, props?: ToastProps) => {
    return sonnerToast.success(title, props);
  },
  
  error: (title: string, props?: ToastProps) => {
    return sonnerToast.error(title, props);
  },
  
  info: (title: string, props?: ToastProps) => {
    return sonnerToast.info(title, props);
  },
  
  warning: (title: string, props?: ToastProps) => {
    return sonnerToast.warning(title, props);
  },
  
  loading: (title: string, props?: ToastProps) => {
    return sonnerToast.loading(title, props);
  }
};

export { useToast } from 'sonner';
