
"use client";

import React from "react";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  // Add error boundary to handle potential context issues
  try {
    return (
      <SonnerToaster 
        position="top-right" 
        closeButton 
        richColors
        expand={false}
        theme="light"
      />
    );
  } catch (error) {
    console.error('Error rendering Toaster:', error);
    return null;
  }
}
