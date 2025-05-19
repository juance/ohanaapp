
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

// Define the toast function with methods type
interface ToastFunction {
  (message: string | ToastOptions): void;
  default: (message: string | ToastOptions) => void;
  success: (message: string | ToastOptions) => void;
  error: (message: string | ToastOptions) => void;
  warning: (message: string | ToastOptions) => void;
  info: (message: string | ToastOptions) => void;
}

// Create the base toast function
const toastFn = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast(message);
  } else {
    const { title, description, variant, duration, action } = message;
    
    if (variant === 'success') {
      sonnerToast.success(title || '', { description, duration, action });
    } else if (variant === 'destructive' || variant === 'error') {
      sonnerToast.error(title || '', { description, duration, action });
    } else if (variant === 'warning') {
      sonnerToast.warning(title || '', { description, duration, action });
    } else if (variant === 'info') {
      sonnerToast.info(title || '', { description, duration, action });
    } else {
      sonnerToast(title || '', { description, duration, action });
    }
  }
};

// Create the complete toast object with methods
const toast = toastFn as ToastFunction;

// Attach the helper methods
toast.default = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast(message);
  } else {
    sonnerToast(message.title || '', { 
      description: message.description,
      duration: message.duration,
      action: message.action
    });
  }
};

toast.success = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.success(message);
  } else {
    sonnerToast.success(message.title || '', { 
      description: message.description,
      duration: message.duration,
      action: message.action
    });
  }
};

toast.error = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.error(message);
  } else {
    sonnerToast.error(message.title || '', { 
      description: message.description,
      duration: message.duration,
      action: message.action
    });
  }
};

toast.warning = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.warning(message);
  } else {
    sonnerToast.warning(message.title || '', { 
      description: message.description,
      duration: message.duration,
      action: message.action
    });
  }
};

toast.info = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast.info(message);
  } else {
    sonnerToast.info(message.title || '', { 
      description: message.description,
      duration: message.duration,
      action: message.action
    });
  }
};

export { toast };
