import { toast as sonnerToast } from "sonner";

export const toast = sonnerToast;

// Also export the type for TypeScript support
export type { ToastT } from "sonner";

// Keep the hook for components that need it
export function useToast() {
  return {
    toast: sonnerToast,
  };
}
