
// Añadiendo servicio de toast para compatibilidad con UserDialog
import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
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

  return sonnerToast(title || '', {
    description,
    duration
  });
};

// Métodos adicionales para compatibilidad
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

export default toast;
