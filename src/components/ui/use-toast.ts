
// Import directly from sonner
import { toast } from "sonner";

// Re-export for consistency
export { toast };

// For backwards compatibility - doesn't use React hooks
export const useToast = () => {
  return { toast };
};
