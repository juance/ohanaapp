
import { toast as sonnerToast } from "sonner";

// Create a custom hook that wraps sonner toast
export const useToast = () => {
  return {
    toast: (title: string, description?: string) => sonnerToast(title, { description }),
    success: (title: string, description?: string) => sonnerToast.success(title, { description }),
    error: (title: string, description?: string) => sonnerToast.error(title, { description }),
    warning: (title: string, description?: string) => sonnerToast.warning(title, { description }),
    info: (title: string, description?: string) => sonnerToast.info(title, { description }),
  };
};

// Export toast functions directly for convenience
export const toast = {
  toast: (title: string, description?: string) => sonnerToast(title, { description }),
  success: (title: string, description?: string) => sonnerToast.success(title, { description }),
  error: (title: string, description?: string) => sonnerToast.error(title, { description }),
  warning: (title: string, description?: string) => sonnerToast.warning(title, { description }),
  info: (title: string, description?: string) => sonnerToast.info(title, { description })
};

// Default export for convenience
export default function useToastHook(title: string, description?: string) {
  sonnerToast(title, { description });
}
