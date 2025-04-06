
import { toast as sonnerToast } from 'sonner';

// Define toast interface that matches what components are using
type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  [key: string]: any;
};

// Create a wrapper around sonner toast to handle our API
function toast(props: ToastProps) {
  const { title, description, variant, ...rest } = props;

  if (variant === 'destructive') {
    return sonnerToast.error(title || '', {
      description,
      ...rest
    });
  }

  return sonnerToast(title || '', {
    description,
    ...rest
  });
}

// Add helper methods
toast.success = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.success(title, options);
};

toast.error = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.error(title, options);
};

toast.info = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.info(title, options);
};

toast.warning = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.warning(title, options);
};

toast.loading = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.loading(title, options);
};

// Use a simple useToast hook that doesn't rely on React's useState
export const useToast = () => {
  return { toast };
};

// Re-export for compatibility
export { toast };
