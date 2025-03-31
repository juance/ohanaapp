import { toast as sonnerToast } from "sonner";

// Export the toast function directly
export const toast = sonnerToast;

// Also keep the hook for components that need it
export function useToast() {
  return {
    toast: sonnerToast,
  };
}
