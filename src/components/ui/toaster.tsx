
"use client"

import * as React from "react"; // Add explicit React import
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return <SonnerToaster position="top-right" richColors closeButton />;
}
