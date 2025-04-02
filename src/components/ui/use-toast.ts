
import { toast } from "@/hooks/use-toast";

// Re-export for backward compatibility with any code still using this import path
export { toast };

// A compatibility layer for code still using useToast
export const useToast = () => {
  return {
    toast,
    dismiss: () => {},
  };
};
