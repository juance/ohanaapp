
import { toast as sonnerToast } from 'sonner';

type ToastOptions = {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
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
    sonnerToast(message);
  } else {
    const { variant: msgVariant, ...rest } = message;
    sonnerToast({
      title: rest.title || 'Notificación',
      description: rest.description,
      duration: rest.duration,
    });
  }
};

// Create the toast function with all methods
const successToast = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.success(message);
  } else {
    const { variant: msgVariant, ...rest } = message;
    sonnerToast.success(rest.title || '', {
      description: rest.description,
      duration: rest.duration
    });
  }
};

const errorToast = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.error(message);
  } else {
    const { variant: msgVariant, ...rest } = message;
    sonnerToast.error(rest.title || '', {
      description: rest.description,
      duration: rest.duration
    });
  }
};

const infoToast = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.info(message);
  } else {
    const { variant: msgVariant, ...rest } = message;
    sonnerToast.info(rest.title || '', {
      description: rest.description,
      duration: rest.duration
    });
  }
};

const warningToast = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.warning(message);
  } else {
    const { variant: msgVariant, ...rest } = message;
    sonnerToast.warning(rest.title || '', {
      description: rest.description,
      duration: rest.duration
    });
  }
};

export const toast = baseToast as ToastFunction;
toast.success = successToast as ToastFunction['success'];
toast.error = errorToast as ToastFunction['error'];
toast.info = infoToast as ToastFunction['info'];
toast.warning = warningToast as ToastFunction['warning'];
