
"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster({ children }: { children?: React.ReactNode }) {
  return (
    <>
      {children}
      <SonnerToaster 
        position="bottom-right"
        toastOptions={{
          duration: 5000,
        }}
      />
    </>
  )
}
