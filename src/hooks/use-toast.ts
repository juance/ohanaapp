
import { ReactNode } from "react";
import { toast as sonnerToast, type ToastT, type ExternalToast } from "sonner";

// Create a type for our toast function that can be called directly and also has methods
export type ToastFunction = {
  (message: ReactNode, opts?: ExternalToast): string | number;
  success: (message: ReactNode, opts?: ExternalToast) => string | number;
  error: (message: ReactNode, opts?: ExternalToast) => string | number;
  warning: (message: ReactNode, opts?: ExternalToast) => string | number;
  info: (message: ReactNode, opts?: ExternalToast) => string | number;
  loading: (message: ReactNode, opts?: ExternalToast) => string | number;
  dismiss: (toastId?: string | number) => void;
  custom: (message: ReactNode, opts?: ExternalToast) => string | number;
  promise: typeof sonnerToast.promise;
  update: typeof sonnerToast.update;
}

// Create the base toast function
const toastFunction = (message: ReactNode, opts?: ExternalToast): string | number => {
  return sonnerToast(message, opts);
};

// Add all the methods from sonner toast to our function
export const toast: ToastFunction = Object.assign(toastFunction, {
  success: (message: ReactNode, opts?: ExternalToast) => sonnerToast.success(message, opts),
  error: (message: ReactNode, opts?: ExternalToast) => sonnerToast.error(message, opts),
  warning: (message: ReactNode, opts?: ExternalToast) => sonnerToast.warning(message, opts),
  info: (message: ReactNode, opts?: ExternalToast) => sonnerToast.info(message, opts),
  loading: (message: ReactNode, opts?: ExternalToast) => sonnerToast.loading(message, opts),
  dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
  custom: sonnerToast.custom,
  promise: sonnerToast.promise,
  update: sonnerToast.update,
});

// Don't use React hooks here - move them to the component level
export type { ToastT };

// Simple function to get the toast in components that need direct access
export function useToast() {
  return {
    toast,
  };
}
