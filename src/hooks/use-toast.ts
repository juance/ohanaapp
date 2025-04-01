
import { ReactNode } from "react";

// Create a type for our toast function that can be called directly and also has methods
export type ToastFunction = {
  (message: ReactNode, opts?: any): void;
  success: (message: ReactNode, opts?: any) => void;
  error: (message: ReactNode, opts?: any) => void;
  warning: (message: ReactNode, opts?: any) => void;
  info: (message: ReactNode, opts?: any) => void;
  loading: (message: ReactNode, opts?: any) => void;
  dismiss: (toastId?: string | number) => void;
  custom: any;
  promise: any;
};

// Simple toast function that just logs to console as a fallback
// This prevents crashes while we can implement a proper toast system later
const toastFunction = (message: ReactNode, opts?: any): void => {
  console.log("[Toast]", message, opts);
};

// Add all the methods
export const toast: ToastFunction = Object.assign(toastFunction, {
  success: (message: ReactNode, opts?: any) => console.log("[Toast Success]", message, opts),
  error: (message: ReactNode, opts?: any) => console.log("[Toast Error]", message, opts),
  warning: (message: ReactNode, opts?: any) => console.log("[Toast Warning]", message, opts),
  info: (message: ReactNode, opts?: any) => console.log("[Toast Info]", message, opts),
  loading: (message: ReactNode, opts?: any) => console.log("[Toast Loading]", message, opts),
  dismiss: (toastId?: string | number) => console.log("[Toast Dismiss]", toastId),
  custom: () => {},
  promise: async (promise: Promise<any>, msgs: any) => {
    try {
      const data = await promise;
      console.log("[Toast Promise Success]", msgs.success);
      return data;
    } catch (error) {
      console.log("[Toast Promise Error]", msgs.error);
      throw error;
    }
  },
});

// Export type for components that need it
export type ToastT = any;

// Simple function to get the toast in components that need direct access
export function useToast() {
  return {
    toast,
  };
}
