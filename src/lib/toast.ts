
import { toast as sonnerToast } from '@/components/ui/toast';

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export const toast = (options: ToastOptions) => {
  return sonnerToast({
    ...options,
    duration: options.duration || 3000,
  });
};

// Add utility methods for common toast patterns
toast.success = (message: string, options: Omit<ToastOptions, 'description' | 'variant'> = {}) => {
  return toast({
    ...options,
    title: options.title || 'Éxito',
    description: message,
    variant: 'success',
  });
};

toast.error = (message: string, options: Omit<ToastOptions, 'description' | 'variant'> = {}) => {
  return toast({
    ...options,
    title: options.title || 'Error',
    description: message,
    variant: 'destructive',
  });
};

toast.info = (message: string, options: Omit<ToastOptions, 'description'> = {}) => {
  return toast({
    ...options,
    title: options.title || 'Información',
    description: message,
  });
};

export default toast;
