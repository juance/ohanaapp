
// Re-export the toast from sonner
import { toast as sonnerToast } from "sonner";

// Export the toast function
export const toast = sonnerToast;

// Export useToast hook for compatibility
export const useToast = () => {
  return {
    toast,
  };
};
