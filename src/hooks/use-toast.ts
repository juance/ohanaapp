import { toast as sonnerToast } from "sonner";

// Exporting the toast object directly
export const toast = sonnerToast;

// Keeping the hook for backward compatibility
export const useToast = () => {
  return {
    toast: sonnerToast,
    dismiss: () => {},
  };
};
