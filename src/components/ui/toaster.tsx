
"use client"

import * as React from "react";
import { ToastContextProvider } from '@/contexts/ToastContext';

export function Toaster({ children }: { children?: React.ReactNode }) {
  return <ToastContextProvider>{children}</ToastContextProvider>;
}
