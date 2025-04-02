
import * as React from "react"
import { toast as sonnerToast, type ToastT } from "sonner"

export type ExternalToast = Parameters<typeof sonnerToast>[1]

const toast = ({
  title,
  description,
  variant = "default",
  ...props
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
} & ExternalToast) => {
  if (variant === "destructive") {
    return sonnerToast.error(title as string, {
      description,
      ...props,
    })
  }
  
  return sonnerToast(title as string, {
    description,
    ...props,
  })
}

// Add success, error, and other common toast types as methods
toast.success = (title: string, props?: ExternalToast) => {
  return sonnerToast.success(title, props);
};

toast.error = (title: string, props?: ExternalToast) => {
  return sonnerToast.error(title, props);
};

toast.info = (title: string, props?: ExternalToast) => {
  return sonnerToast.info(title, props);
};

toast.warning = (title: string, props?: ExternalToast) => {
  return sonnerToast.warning(title, props);
};

toast.loading = (title: string, props?: ExternalToast) => {
  return sonnerToast.loading(title, props);
};

export { toast, sonnerToast }

export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss
  }
}
