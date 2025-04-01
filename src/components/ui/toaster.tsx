
"use client";

import React from 'react';
import { Toaster as SonnerToaster } from "sonner";

export function Toaster(): JSX.Element {
  return (
    <SonnerToaster 
      position="top-right"
      richColors
      closeButton
      expand={false}
      theme="light"
    />
  );
}
