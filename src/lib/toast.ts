
import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

export const toast = (options: ToastOptions) => {
  const { title, description, variant = "default" } = options;

  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
    });
  }

  if (variant === "success") {
    return sonnerToast.success(title, {
      description,
    });
  }

  return sonnerToast(title, {
    description,
  });
};

// Convenience methods
toast.error = (message: string) => {
  sonnerToast.error("Error", { description: message });
};

toast.success = (message: string) => {
  sonnerToast.success("Éxito", { description: message });
};

toast.info = (message: string) => {
  sonnerToast.info("Información", { description: message });
};

toast.warning = (message: string) => {
  sonnerToast.warning("Advertencia", { description: message });
};
