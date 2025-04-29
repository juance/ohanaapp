
import { toast as sonnerToast } from '@/components/ui/sonner';

type ToastOptions = {
  title?: string;
  description?: string;
  duration?: number;
};

type ToastFunction = {
  (message: string): void;
  (options: ToastOptions): void;
  success: {
    (message: string): void;
    (options: ToastOptions): void;
  };
  error: {
    (message: string): void;
    (options: ToastOptions): void;
  };
  info: {
    (message: string): void;
    (options: ToastOptions): void;
  };
  warning: {
    (message: string): void;
    (options: ToastOptions): void;
  };
};

// Base toast function
const baseToast = (message: string | ToastOptions, variant = 'default') => {
  if (typeof message === 'string') {
    sonnerToast({
      title: message,
      variant
    });
  } else {
    sonnerToast({
      title: message.title || 'Notificación',
      description: message.description,
      duration: message.duration,
      variant
    });
  }
};

// Create the toast function with all methods
const successToast = (message: string | ToastOptions) => baseToast(message, 'success');
const errorToast = (message: string | ToastOptions) => baseToast(message, 'destructive');
const infoToast = (message: string | ToastOptions) => baseToast(message, 'default');
const warningToast = (message: string | ToastOptions) => baseToast(message, 'warning');

export const toast = baseToast as ToastFunction;
toast.success = successToast as ToastFunction['success'];
toast.error = errorToast as ToastFunction['error'];
toast.info = infoToast as ToastFunction['info'];
toast.warning = warningToast as ToastFunction['warning'];
