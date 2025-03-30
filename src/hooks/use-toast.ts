
// We'll simplify this file to just re-export directly from sonner
// This avoids any potential React context issues
import { toast } from "sonner";

// Export the toast function directly from sonner
export { toast };

// Export a simplified useToast hook for backward compatibility
export function useToast() {
  return { toast };
}
