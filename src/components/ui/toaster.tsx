
// Use JSX instead of creating elements to ensure proper React integration
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return <SonnerToaster position="top-right" richColors closeButton />;
}
