
"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  [key: string]: any;
}

// Create a toast function that properly handles the variant
export const toast = (props: ToastProps) => {
  const { title, description, variant, ...rest } = props;

  if (variant === 'destructive') {
    return sonnerToast.error(title || '', {
      description,
      ...rest
    });
  }

  return sonnerToast(title || '', {
    description,
    ...rest
  });
};

// Add helper methods
toast.success = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.success(title, options);
};

toast.error = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.error(title, options);
};

toast.info = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.info(title, options);
};

toast.warning = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.warning(title, options);
};

toast.loading = (title: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast.loading(title, options);
};

// Create a React hook
export function useToast() {
  return { toast };
}
