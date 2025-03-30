
// Direct re-export of Sonner's toast functionality
import { toast } from "sonner";

// Export the toast function directly
export { toast };

// Simple hook implementation for backwards compatibility
export function useToast() {
  return { toast };
}
