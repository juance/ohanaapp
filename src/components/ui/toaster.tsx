
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  // Usando el componente SonnerToaster directamente, sin depender de useToast
  return <SonnerToaster position="top-right" closeButton richColors />;
}
