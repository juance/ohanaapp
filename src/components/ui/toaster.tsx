
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right" 
      closeButton 
      richColors
      expand={false}
      theme="light"
    />
  );
}
