
"use client";

import React from 'react';
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right"
      richColors
      className="toaster"
    />
  );
}
