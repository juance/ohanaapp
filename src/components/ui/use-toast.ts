
// Import directly from sonner
import { toast } from "sonner";

// Re-export for consistency
export { toast };

// For backwards compatibility
export const useToast = () => {
  return { toast };
};
