
import { toast } from "sonner";

// Export a simplified useToast hook for backward compatibility
export const useToast = () => {
  return { toast };
};

// Export the toast function directly
export { toast };
