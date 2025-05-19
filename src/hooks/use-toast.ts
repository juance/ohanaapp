
"use client";

import React from "react";
import { toast, ToastOptions } from "@/lib/toast";

// Create a simplified useToast function that returns the toast function
export function useToast() {
  return { toast };
}

// Re-export the toast function for convenience
export { toast };
export type { ToastOptions };
