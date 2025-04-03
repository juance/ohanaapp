
"use client"

import { Toaster as SonnerToaster } from "sonner"

interface ToasterProps {
  children?: React.ReactNode;
  // Add any additional props you need
}

// Use the actual sonner Toaster component 
const Toaster = (props: ToasterProps) => {
  return (
    <>
      {props.children}
      <SonnerToaster 
        position="bottom-right"
        toastOptions={{
          duration: 5000,
        }}
      />
    </>
  )
}

export { Toaster }
