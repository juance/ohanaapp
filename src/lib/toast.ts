
import { toast as sonnerToast } from "sonner";

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export const toast = (options: ToastOptions) => {
  // Map our variant to sonner's built-in types
  const type = options.variant === 'destructive' ? 'error' : 
               options.variant === 'success' ? 'success' : undefined;
  
  return sonnerToast(options.title || '', {
    description: options.description,
    duration: options.duration || 3000,
    action: options.action,
    onDismiss: options.onDismiss,
    // Use type for built-in variants
    ...(type ? { type } : {})
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

// Add warning method to match with the GitHubSyncButton usage
toast.warning = (message: string, options: Omit<ToastOptions, 'description' | 'variant'> = {}) => {
  return sonnerToast.warning(options.title || 'Advertencia', {
    description: message,
    duration: options.duration || 3000,
  });
};

export default toast;
