
// Simple toaster component that renders the Sonner Toaster
// without using any React hooks or context
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
