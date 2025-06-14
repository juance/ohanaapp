
"use client";

import React from "react";
import { ToastContainer } from "@/components/ui/toast-container";

export function Toaster() {
  // Use our custom toast container instead of the problematic useToast hook
  return <ToastContainer />;
}
