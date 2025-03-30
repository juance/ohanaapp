
import React from "react";
import { Toaster as SonnerToaster } from "sonner";

// Componente simple que renderiza el Toaster de Sonner
// sin usar ningún hook de React
export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      richColors
      closeButton
    />
  );
}
