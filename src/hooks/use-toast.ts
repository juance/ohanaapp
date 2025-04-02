
import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = React.ComponentProps<typeof sonnerToast>

const toast = sonnerToast

export { toast, useToast }

function useToast() {
  return {
    toast,
    dismiss: () => sonnerToast.dismiss(),
  }
}
