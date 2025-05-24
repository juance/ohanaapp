
import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export const toast = (options: ToastOptions | string) => {
  if (typeof options === 'string') {
    sonnerToast(options);
    return;
  }

  const { title, description, variant = 'default', duration = 4000 } = options;
  
  if (variant === 'destructive') {
    sonnerToast.error(title || 'Error', {
      description,
      duration
    });
  } else {
    sonnerToast.success(title || 'Éxito', {
      description,
      duration
    });
  }
};

// Exportar métodos específicos para facilidad de uso
toast.success = (title: string, description?: string) => {
  sonnerToast.success(title, { description });
};

toast.error = (title: string, description?: string) => {
  sonnerToast.error(title, { description });
};

toast.info = (title: string, description?: string) => {
  sonnerToast(title, { description });
};

toast.warning = (title: string, description?: string) => {
  sonnerToast.warning(title, { description });
};
