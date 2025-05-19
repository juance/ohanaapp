
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Create a wrapper for the toast function
const toast = {
  // Default toast
  default: (message: string | ToastOptions) => {
    if (typeof message === 'string') {
      sonnerToast(message);
    } else {
      sonnerToast(message.title || '', { 
        description: message.description,
        duration: message.duration,
        action: message.action
      });
    }
  },

  // Success toast
  success: (message: string | ToastOptions) => {
    if (typeof message === 'string') {
      sonnerToast.success(message);
    } else {
      sonnerToast.success(message.title || '', { 
        description: message.description,
        duration: message.duration,
        action: message.action
      });
    }
  },

  // Error toast
  error: (message: string | ToastOptions) => {
    if (typeof message === 'string') {
      sonnerToast.error(message);
    } else {
      sonnerToast.error(message.title || '', { 
        description: message.description,
        duration: message.duration,
        action: message.action
      });
    }
  },

  // Warning toast
  warning: (message: string | ToastOptions) => {
    if (typeof message === 'string') {
      sonnerToast.warning(message);
    } else {
      sonnerToast.warning(message.title || '', { 
        description: message.description,
        duration: message.duration,
        action: message.action
      });
    }
  },

  // Info toast
  info: (message: string | ToastOptions) => {
    if (typeof message === 'string') {
      sonnerToast.info(message);
    } else {
      sonnerToast.info(message.title || '', { 
        description: message.description,
        duration: message.duration,
        action: message.action
      });
    }
  },
};

export { toast };
