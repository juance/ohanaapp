
import { toast as sonnerToast } from "sonner";

// Define toast interface
export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  [key: string]: any;
}

// Create a toast function that properly handles objects and strings
function toastFunction(props: ToastProps | string) {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  const { title, description, variant, ...rest } = props;

  if (variant === 'destructive') {
    return sonnerToast.error(title || '', {
      description,
      ...rest
    });
  } else if (variant === 'success') {
    return sonnerToast.success(title || '', {
      description,
      ...rest
    });
  } else if (variant === 'warning') {
    return sonnerToast.warning(title || '', {
      description,
      ...rest
    });
  } else if (variant === 'info') {
    return sonnerToast.info(title || '', {
      description,
      ...rest
    });
  }

  return sonnerToast(title || '', {
    description,
    ...rest
  });
}

// Create toast object with the function as default and helper methods
export const toast = Object.assign(toastFunction, {
  success: (message: string | ToastProps) => {
    if (typeof message === 'string') {
      return sonnerToast.success(message);
    }
    return sonnerToast.success(message.title || '', {
      description: message.description,
      ...message
    });
  },
  error: (message: string | ToastProps) => {
    if (typeof message === 'string') {
      return sonnerToast.error(message);
    }
    return sonnerToast.error(message.title || '', {
      description: message.description,
      ...message
    });
  },
  warning: (message: string | ToastProps) => {
    if (typeof message === 'string') {
      return sonnerToast.warning(message);
    }
    return sonnerToast.warning(message.title || '', {
      description: message.description,
      ...message
    });
  },
  info: (message: string | ToastProps) => {
    if (typeof message === 'string') {
      return sonnerToast.info(message);
    }
    return sonnerToast.info(message.title || '', {
      description: message.description,
      ...message
    });
  },
  loading: (title: string, options?: Omit<ToastProps, 'title'>) => {
    return sonnerToast.loading(title, options);
  }
});

export default toast;
