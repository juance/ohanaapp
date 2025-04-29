
import { toast as useToast } from "@/hooks/use-toast";

// Direct mapping to original toast function
export const toast = {
  ...useToast,
  success: (message: string) => useToast({
    title: "Success",
    description: message
  }),
  error: (message: string) => useToast({
    variant: "destructive",
    title: "Error",
    description: message
  }),
  warning: (message: string) => useToast({
    variant: "destructive",
    title: "Warning",
    description: message
  }),
  info: (message: string) => useToast({
    title: "Info",
    description: message
  })
};

export default toast;
