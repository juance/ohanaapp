
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

export { toast, sonnerToast }

export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss
  }
}
