
"use client"

import * as React from "react"
import { ToastContextProvider } from '@/contexts/ToastContext';

// This is kept for backwards compatibility but now uses our custom toast system
const Toaster = ({ ...props }: React.PropsWithChildren) => {
  return <ToastContextProvider>{props.children}</ToastContextProvider>;
};

export { Toaster }
