
import { toast as sonnerToast } from 'sonner';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  [key: string]: any;
};

// Create a wrapper function
export const toast = {
  // Base toast function for direct calling
  default: (title: string, options?: Omit<ToastProps, 'title'>) => {
    return sonnerToast(title, options);
  },
  
  // Helper methods
  success: (title: string, options?: Omit<ToastProps, 'title'>) => {
    return sonnerToast.success(title, options);
  },
  
  error: (title: string, options?: Omit<ToastProps, 'title'>) => {
    return sonnerToast.error(title, options);
  },
  
  info: (title: string, options?: Omit<ToastProps, 'title'>) => {
    return sonnerToast.info(title, options);
  },
  
  warning: (title: string, options?: Omit<ToastProps, 'title'>) => {
    return sonnerToast.warning(title, options);
  },
  
  loading: (title: string, options?: Omit<ToastProps, 'title'>) => {
    return sonnerToast.loading(title, options);
  }
};
