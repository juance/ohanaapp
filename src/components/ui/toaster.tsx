
// We'll simplify this file to just use Sonner's Toaster directly
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
