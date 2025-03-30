
import React from "react";
import { Toaster as SonnerToaster } from "sonner";

// Simple component that renders the Sonner Toaster
// without using any React hooks
export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      richColors
      closeButton
    />
  );
}
