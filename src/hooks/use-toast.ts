
import { toast } from "@/lib/toast";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  [key: string]: any;
};

// Re-export the toast function
export { toast };

// Export useToast for Hook usage
export function useToast() {
  return { toast };
}
