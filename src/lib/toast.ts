
import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export const toast = (options: ToastOptions | string) => {
  if (typeof options === 'string') {
    return sonnerToast(options);
  }

  const { title, description, variant, duration } = options;

  if (variant === 'destructive') {
    return sonnerToast.error(title || 'Error', {
      description,
      duration
    });
  }

  if (variant === 'success') {
    return sonnerToast.success(title || 'Success', {
      description,
      duration
    });
  }

  return sonnerToast(title || '', {
    description,
    duration
  });
};

// Additional methods for compatibility
toast.success = (message: string, options?: ToastOptions) => {
  return sonnerToast.success(options?.title || 'Éxito', {
    description: message,
    duration: options?.duration
  });
};

toast.error = (message: string, options?: ToastOptions) => {
  return sonnerToast.error(options?.title || 'Error', {
    description: message,
    duration: options?.duration
  });
};

toast.info = (message: string, options?: ToastOptions) => {
  return sonnerToast.info(options?.title || 'Información', {
    description: message,
    duration: options?.duration
  });
};

toast.warning = (message: string, options?: ToastOptions) => {
  return sonnerToast.warning(options?.title || 'Advertencia', {
    description: message,
    duration: options?.duration
  });
};

export default toast;
