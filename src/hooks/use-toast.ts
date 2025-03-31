
import { toast as sonnerToast } from "sonner";

// Re-export sonner toast with our desired interface
export const toast = {
  // Basic toast function
  custom: sonnerToast,
  
  // Success variant
  success: (message: string) => {
    sonnerToast.success(message);
  },
  
  // Error variant
  error: (message: string) => {
    sonnerToast.error(message);
  },
  
  // Info variant
  info: (message: string) => {
    sonnerToast.info(message);
  }
};

// For compatibility with the existing useToast interface
export const useToast = () => {
  return {
    toast,
    // Empty toasts array to maintain interface compatibility
    toasts: [],
    // No-op dismiss function for compatibility
    dismiss: () => {}
  };
};
