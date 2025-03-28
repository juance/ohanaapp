
import { toast } from "sonner";

// Export the toast function directly from sonner
export { toast };

// Export a simplified useToast hook for backward compatibility
export function useToast() {
  return { toast };
}
