
import { toast as sonnerToast, ToastT } from "sonner";

// Export the toast function directly
export const toast = sonnerToast;

// Also export the type for TypeScript support
export { type ToastT };

// Keep the hook for components that need it
export function useToast() {
  return {
    toast: sonnerToast,
  };
}
