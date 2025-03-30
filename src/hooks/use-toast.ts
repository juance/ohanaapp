
// Using sonner directly without React hooks
import { toast as sonnerToast } from "sonner";

// Create a non-hook based toast object that can be imported anywhere
export const toast = {
  // Basic toast types
  info: (message: string, options?: any) => 
    sonnerToast.info(message, options),
  
  success: (message: string, options?: any) => 
    sonnerToast.success(message, options),
  
  warning: (message: string, options?: any) => 
    sonnerToast.warning(message, options),
  
  error: (message: string, options?: any) => 
    sonnerToast.error(message, options),
  
  // Default toast
  default: (message: string, options?: any) => 
    sonnerToast(message, options),
  
  // Allow direct access to original function
  raw: sonnerToast
};

// Export a compatibility function that returns the toast object
// WITHOUT using any React hooks
export function useToast() {
  // Simply return the toast object without any React hook calls
  return { toast };
}
