
import { toast } from "sonner";

// Sonner doesn't export useToast anymore, so we're creating a compatible implementation
export const useToast = () => {
  return {
    toast,
    // For backwards compatibility with any code still using the old API
    dismiss: () => {},
  };
};

export { toast };
