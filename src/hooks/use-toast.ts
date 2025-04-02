
import React from 'react';
import { toast as sonnerToast, Toaster } from 'sonner';

// Export the toast function directly
export const toast = sonnerToast;

// Create a simple hook for compatibility with existing code
export const useToast = () => {
  return {
    toast: sonnerToast
  };
};

export { Toaster as SonnerToaster };
