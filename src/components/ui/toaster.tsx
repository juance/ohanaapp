
// Use Sonner's Toaster directly without any custom React hooks
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      richColors
      closeButton
    />
  );
}
