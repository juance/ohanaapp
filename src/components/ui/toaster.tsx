
import { Toaster as SonnerToaster } from "sonner";

// Componente simplificado sin hooks de React
export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      richColors
      closeButton
    />
  );
}
