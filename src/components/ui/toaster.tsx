
// Toaster simple que solo renderiza el componente Toaster de Sonner
// sin usar ningún hook de React ni contexto
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
