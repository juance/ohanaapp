
// Import the toast function directly from sonner
import { toast as sonnerToast, type ToastOptions } from "sonner";

// Create a custom toast function to avoid conflicts
// and provide a consistent interface
export const toast = {
  // Basic toast types
  info: (message: string, options?: ToastOptions) => 
    sonnerToast.info(message, options),
  
  success: (message: string, options?: ToastOptions) => 
    sonnerToast.success(message, options),
  
  warning: (message: string, options?: ToastOptions) => 
    sonnerToast.warning(message, options),
  
  error: (message: string, options?: ToastOptions) => 
    sonnerToast.error(message, options),
  
  // Default toast
  default: (message: string, options?: ToastOptions) => 
    sonnerToast(message, options),
  
  // Allow direct access to the original function
  raw: sonnerToast
};

// Export a hook-like function for backward compatibility
export function useToast() {
  return { toast };
}
