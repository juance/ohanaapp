
import { toast as sonnerToast } from "sonner";
import { ReactNode } from "react";
import { ExternalToast } from "sonner";

// Re-export sonner toast with our desired interface
export const toast = {
  // Basic toast function - this allows direct calling
  // Now toast can be called directly with a string message
  (message: string): string | number {
    return sonnerToast(message);
  },
  
  // Support for object parameter with title and description
  ({ title, description }: { title: string; description: string }) {
    return sonnerToast(title, {
      description
    });
  },
  
  // Expose the original sonner toast for direct access
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
