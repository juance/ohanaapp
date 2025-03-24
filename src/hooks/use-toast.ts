
import { Toast, useToast as useToastOriginal } from "@/components/ui/toast"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>
import { ToastAction } from "@/components/ui/toast"

type ToastOptions = {
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

// Create a toast function that can be imported and used directly
const toast = {
  success: (message: string) => {
    const { toast } = useToastOriginal()
    toast({
      title: "Success",
      description: message,
    })
  },
  error: (message: string) => {
    const { toast } = useToastOriginal()
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    })
  },
  info: (message: string) => {
    const { toast } = useToastOriginal()
    toast({
      title: "Info",
      description: message,
    })
  },
}

export { useToastOriginal as useToast, toast, type ToastOptions }
