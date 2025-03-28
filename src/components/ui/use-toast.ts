
import { toast } from "sonner";

// Re-export sonner toast to maintain backward compatibility
export { toast };

// Re-export a simplified useToast hook that returns the toast function
export const useToast = () => {
  return { toast };
};
