
import { toast as sonnerToast } from "sonner";

// Create a toast implementation using sonner without React hooks
export const toast = sonnerToast;

export const useToast = () => {
  return {
    toast,
  };
};
