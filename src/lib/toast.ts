
// Re-export toast from use-toast.ts with additional methods 
import { toast as sonnerToast } from 'sonner';

// Define the base toast function
const toastFunction = (props: any) => {
  // If it's an object with title/description (shadcn style)
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
  
  // If it's a simple message string (sonner style)
  if (typeof props === 'string') {
    const message = props;
    const options = arguments[1];
    return sonnerToast(message, options);
  }
  
  return sonnerToast(props);
};

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
