
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  // Simplificando el componente para evitar problemas con hooks
  return <SonnerToaster position="top-right" richColors closeButton theme="light" />;
}
