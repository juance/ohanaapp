
import * as React from "react"; // Add explicit React import
import { toast as sonnerToast } from 'sonner';

// Export the toast function directly from sonner
export const toast = sonnerToast;

// Create a simple hook for compatibility with existing code
export const useToast = () => {
  return {
    toast: sonnerToast
  };
};
