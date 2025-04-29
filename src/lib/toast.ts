
// Re-export toast from use-toast.ts with additional methods 
import { toast as sonnerToast } from 'sonner';

type ToastFunction = {
  (props: string | object): string | number;
  success: (message: string, options?: any) => string | number;
  error: (message: string, options?: any) => string | number;
  info: (message: string, options?: any) => string | number;
  warning: (message: string, options?: any) => string | number;
  loading: (message: string, options?: any) => string | number;
  default: (message: string, options?: any) => string | number;
  custom: (title: string, description?: string, options?: any) => string | number;
};

// Define the base toast function
const toastFunction = function(props: any): string | number {
  // Si es un objeto con title/description (estilo shadcn)
  if (typeof props === 'object' && (props.title || props.description)) {
    const { title, description, variant, ...rest } = props;
    
    if (variant === 'destructive') {
      return sonnerToast.error(title || '', {
        description,
        ...rest
      });
    }
    
    return sonnerToast(title || '', {
      description,
      ...rest
    });
  }
  
  // Si es un simple mensaje string (estilo sonner)
  if (typeof props === 'string') {
    const message = props;
    // Access options from second parameter, not 'arguments'
    const options = arguments[1] as any;
    return sonnerToast(message, options);
  }
  
  return sonnerToast(props);
} as ToastFunction;

// Add all the helper methods
toastFunction.success = (message: string, options?: any) => sonnerToast.success(message, options);
toastFunction.error = (message: string, options?: any) => sonnerToast.error(message, options);
toastFunction.info = (message: string, options?: any) => sonnerToast.info(message, options);
toastFunction.warning = (message: string, options?: any) => sonnerToast.warning(message, options);
toastFunction.loading = (message: string, options?: any) => sonnerToast.loading(message, options);

// Add the default method for classic object style
toastFunction.default = (message: string, options?: any) => sonnerToast(message, options);

// Add custom toast with title and description
toastFunction.custom = (title: string, description?: string, options?: any) => {
  return sonnerToast(title, {
    description,
    ...options
  });
};

// Export as both named and default export
export const toast = toastFunction;
export default toastFunction;
