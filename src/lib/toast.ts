
import { toast } from 'sonner';

// Re-export the toast function
export { toast };

// Export a useToast function that matches the expected interface
export const useToast = () => {
  return { toast };
};
