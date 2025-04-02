
import React from 'react';
import { toast as sonnerToast, Toaster as SonnerToaster, Toast } from 'sonner';

export type ToastProps = Toast & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

// Export the toast function directly
export const toast = sonnerToast;

// Create a simple hook for compatibility with existing code
export const useToast = () => {
  return {
    toast: sonnerToast
  };
};

export { SonnerToaster };
