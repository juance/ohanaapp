
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
};

export const toast = {
  toast: (title: string, description?: string) => sonnerToast(title, { description }),
  success: (title: string, description?: string) => sonnerToast.success(title, { description }),
  error: (title: string, description?: string) => sonnerToast.error(title, { description }),
  warning: (title: string, description?: string) => sonnerToast.warning(title, { description }),
  info: (title: string, description?: string) => sonnerToast.info(title, { description }),
};

export const useToast = () => {
  return toast;
};

export default useToast;
