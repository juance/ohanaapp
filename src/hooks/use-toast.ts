
// Import the toast function directly from sonner
import { toast as sonnerToast } from "sonner";

// Create a custom toast function to avoid conflicts
// and provide a consistent interface
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
  
  // Allow direct access to the original function
  raw: sonnerToast
};

// Export a simplified useToast function that doesn't rely on React hooks
export function useToast() {
  return { toast };
}
