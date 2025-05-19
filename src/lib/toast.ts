
import { toast as sonnerToast } from "sonner";

export const toast = {
  info: (message: string) => 
    sonnerToast(message, { 
      position: "top-right", 
      duration: 4000 
    }),
    
  success: (message: string) => 
    sonnerToast.success(message, { 
      position: "top-right", 
      duration: 4000 
    }),
    
  error: (message: string) => 
    sonnerToast.error(message, { 
      position: "top-right", 
      duration: 6000 
    }),
    
  warning: (message: string) => 
    sonnerToast.warning(message, { 
      position: "top-right", 
      duration: 5000 
    }),
    
  // Generic method accepting options object
  default: (options: any) => sonnerToast(options),
  
  // Method to support legacy format 
  // (accepts object with title and description)
  message: (payload: any) => {
    if (typeof payload === 'string') {
      return sonnerToast(payload);
    }
    
    const { title, description, ...rest } = payload;
    return sonnerToast(title, { 
      description,
      ...rest
    });
  },

  // Added to match interface used in components
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  loading: sonnerToast.loading,
  dismiss: sonnerToast.dismiss,
};

// Default export for direct access
export default toast;
