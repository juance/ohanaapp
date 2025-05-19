
import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";
  duration?: number;
  description?: string;
  [key: string]: any;
}

type ToastFunction = {
  (message: string, options?: ToastOptions): string | number;
  info: (message: string, options?: ToastOptions) => string | number;
  success: (message: string, options?: ToastOptions) => string | number;
  error: (message: string, options?: ToastOptions) => string | number;
  warning: (message: string, options?: ToastOptions) => string | number;
  default: (options: any) => string | number;
  message: (payload: any) => string | number;
  promise: typeof sonnerToast.promise;
  custom: typeof sonnerToast.custom;
  loading: typeof sonnerToast.loading;
  dismiss: typeof sonnerToast.dismiss;
};

export const toast: ToastFunction = ((message: string, options?: ToastOptions) => {
  return sonnerToast(message, { 
    position: "top-right", 
    duration: 4000,
    ...options
  });
}) as ToastFunction;

toast.info = (message: string, options?: ToastOptions) => 
  sonnerToast(message, { 
    position: "top-right", 
    duration: 4000,
    ...options
  });
    
toast.success = (message: string, options?: ToastOptions) => 
  sonnerToast.success(message, { 
    position: "top-right", 
    duration: 4000,
    ...options
  });
    
toast.error = (message: string, options?: ToastOptions) => 
  sonnerToast.error(message, { 
    position: "top-right", 
    duration: 6000,
    ...options
  });
    
toast.warning = (message: string, options?: ToastOptions) => 
  sonnerToast.warning(message, { 
    position: "top-right", 
    duration: 5000,
    ...options
  });
    
// Generic method accepting options object
toast.default = (options: any) => sonnerToast(options);
  
// Method to support legacy format 
// (accepts object with title and description)
toast.message = (payload: any) => {
  if (typeof payload === 'string') {
    return sonnerToast(payload);
  }
    
  const { title, description, ...rest } = payload;
  return sonnerToast(title, { 
    description,
    ...rest
  });
};

// Added to match interface used in components
toast.promise = sonnerToast.promise;
toast.custom = sonnerToast.custom;
toast.loading = sonnerToast.loading;
toast.dismiss = sonnerToast.dismiss;

// Default export for direct access
export default toast;
