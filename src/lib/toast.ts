
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
  onDismiss?: () => void; // Added to support usage in notificationService.ts
  items?: any; // Added to support usage in ticketServiceCore.ts
  [key: string]: any; // Allow any additional properties
}

// Define the toast function with methods type
interface ToastFunction {
  (message: string | ToastOptions): void;
  default: (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => void;
  success: (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => void;
  error: (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => void;
  warning: (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => void;
  info: (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => void;
}

// Create the base toast function
const toastFn = (message: string | ToastOptions) => {
  if (typeof message === 'string') {
    sonnerToast(message);
  } else {
    const { title, description, variant, duration, action, ...rest } = message;
    
    if (variant === 'success') {
      sonnerToast.success(title || '', { description, duration, action, ...rest });
    } else if (variant === 'destructive' || variant === 'error') {
      // Fixed comparison by checking both 'destructive' and 'error'
      sonnerToast.error(title || '', { description, duration, action, ...rest });
    } else if (variant === 'warning') {
      sonnerToast.warning(title || '', { description, duration, action, ...rest });
    } else if (variant === 'info') {
      sonnerToast.info(title || '', { description, duration, action, ...rest });
    } else {
      sonnerToast(title || '', { description, duration, action, ...rest });
    }
  }
};

// Create the complete toast object with methods
const toast = toastFn as ToastFunction;

// Attach the helper methods that support both calling styles:
// - toast.success("message")
// - toast.success("title", { description: "message" })
toast.default = (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => {
  if (typeof message === 'string') {
    sonnerToast(message, options || {});
  } else {
    const { title, ...rest } = message;
    sonnerToast(title || '', rest);
  }
};

toast.success = (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => {
  if (typeof message === 'string') {
    sonnerToast.success(message, options || {});
  } else {
    const { title, ...rest } = message;
    sonnerToast.success(title || '', rest);
  }
};

toast.error = (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => {
  if (typeof message === 'string') {
    sonnerToast.error(message, options || {});
  } else {
    const { title, ...rest } = message;
    sonnerToast.error(title || '', rest);
  }
};

toast.warning = (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => {
  if (typeof message === 'string') {
    sonnerToast.warning(message, options || {});
  } else {
    const { title, ...rest } = message;
    sonnerToast.warning(title || '', rest);
  }
};

toast.info = (message: string | ToastOptions, options?: Omit<ToastOptions, 'title'>) => {
  if (typeof message === 'string') {
    sonnerToast.info(message, options || {});
  } else {
    const { title, ...rest } = message;
    sonnerToast.info(title || '', rest);
  }
};

export { toast };
export type { ToastOptions };
