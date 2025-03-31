
import { toast as sonnerToast } from "sonner";
import { ReactNode } from "react";
import { ExternalToast } from "sonner";

// Create a function with additional properties
type ToastFunction = {
  (message: string): string | number;
  (options: { title: string; description: string; variant?: string }): string | number;
  custom: typeof sonnerToast;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

// Create the base function
const toastFn = (
  message: string | { title: string; description: string; variant?: string }
): string | number => {
  if (typeof message === "string") {
    return sonnerToast(message);
  } else {
    // Extract variant if it exists and use it as part of options
    const { title, description, variant } = message;
    return sonnerToast(title, {
      description,
      // If there's a variant, pass it as a class name
      className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : undefined
    });
  }
};

// Add properties to create our composite toast object
export const toast = Object.assign(toastFn, {
  custom: sonnerToast,
  
  success: (message: string) => {
    sonnerToast.success(message);
  },
  
  error: (message: string) => {
    sonnerToast.error(message);
  },
  
  info: (message: string) => {
    sonnerToast.info(message);
  }
}) as ToastFunction;

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
