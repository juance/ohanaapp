
// Direct import of sonner toast API
import { toast as sonnerToast } from "sonner";

// Create a toast object that can be imported anywhere without hooks
export const toast = {
  info: (message: string, options?: any) => 
    sonnerToast.info(message, options),
  
  success: (message: string, options?: any) => 
    sonnerToast.success(message, options),
  
  warning: (message: string, options?: any) => 
    sonnerToast.warning(message, options),
  
  error: (message: string, options?: any) => 
    sonnerToast.error(message, options),
  
  default: (message: string, options?: any) => 
    sonnerToast(message, options),
  
  raw: sonnerToast
};

// Helper function that doesn't use any React hooks
export function useToast() {
  return { toast };
}
