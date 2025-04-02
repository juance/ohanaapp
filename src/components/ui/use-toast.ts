
// Re-export toast from sonner
import { toast } from 'sonner';

// Simple hook that returns the toast function
export const useToast = () => {
  return { toast };
};

export { toast };
