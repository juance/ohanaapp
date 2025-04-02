
import { toast } from "sonner";

export { toast };

export const useToast = () => {
  return {
    toast,
    // For backwards compatibility with any code still using the old API
    dismiss: () => {},
  };
};

