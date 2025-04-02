
import { Toaster } from 'sonner';

// Export the toast function directly from sonner
export { toast } from 'sonner';

// Create a simple hook for compatibility with existing code
export const useToast = () => {
  return {
    toast
  };
};

// Re-export the Toaster component for convenience
export { Toaster as SonnerToaster };
