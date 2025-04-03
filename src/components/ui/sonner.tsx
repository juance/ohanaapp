
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { ToastContextProvider } from '@/contexts/ToastContext';

// This is kept for backwards compatibility but now uses our custom toast system
const Toaster = ({ ...props }: React.PropsWithChildren) => {
  const { theme = "system" } = useTheme()

  return <>{props.children}</>;
}

export { Toaster }
