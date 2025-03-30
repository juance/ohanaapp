
// Import sonner toast directly
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

// No React hooks used! This is just a plain function that returns an object
export function useToast() {
  return { toast };
}
