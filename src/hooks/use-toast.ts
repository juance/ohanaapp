
import { toast } from "sonner";

// Export the toast function directly
export { toast };

// Export a simplified useToast hook for backward compatibility
export function useToast() {
  return { toast };
}
