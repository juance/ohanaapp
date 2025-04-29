
import { toast as sonnerToast } from 'sonner';

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
    sonnerToast(message);
  } else {
    sonnerToast({
      title: message.title || 'Notificación',
      description: message.description,
      duration: message.duration,
    });
  }
};

// Create the toast function with all methods
const successToast = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.success(message);
  } else {
    sonnerToast.success(message.title || '', {
      description: message.description,
      duration: message.duration
    });
  }
};

const errorToast = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.error(message);
  } else {
    sonnerToast.error(message.title || '', {
      description: message.description,
      duration: message.duration
    });
  }
};

const infoToast = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.info(message);
  } else {
    sonnerToast.info(message.title || '', {
      description: message.description,
      duration: message.duration
    });
  }
};

const warningToast = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.warning(message);
  } else {
    sonnerToast.warning(message.title || '', {
      description: message.description,
      duration: message.duration
    });
  }
};

export const toast = baseToast as ToastFunction;
toast.success = successToast as ToastFunction['success'];
toast.error = errorToast as ToastFunction['error'];
toast.info = infoToast as ToastFunction['info'];
toast.warning = warningToast as ToastFunction['warning'];
