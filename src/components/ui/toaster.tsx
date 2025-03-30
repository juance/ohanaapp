
import { StrictMode } from "react";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <StrictMode>
      <SonnerToaster 
        position="top-right"
        richColors
        closeButton
      />
    </StrictMode>
  );
}
