
"use client";

import React from "react";
import { ToastContainer } from "@/components/ui/toast-container";

export function Toaster() {
  // Remove the useToast hook usage that was causing React context issues
  // Use our simpler toast container instead
  return <ToastContainer />;
}
