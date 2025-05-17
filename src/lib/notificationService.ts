
import { toast } from "@/hooks/use-toast";

export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
  // Use the toast function with appropriate properties
  toast({
    title: type.toUpperCase(),
    description: message,
    variant: type === 'error' ? 'destructive' : 'default',
  });
};
