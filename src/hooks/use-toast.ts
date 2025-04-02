
import { toast as sonnerToast } from 'sonner';
import type { ExternalToast } from 'sonner';
import * as React from 'react';

type ToastProps = Parameters<typeof sonnerToast.success>[1];

// Create a callable wrapper function for the toast
function toastWrapper(props: {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  [key: string]: unknown;
}) {
  const { title, description, variant, ...rest } = props;
  
  if (variant === 'destructive') {
    return sonnerToast.error(title || '', { description, ...rest });
  }
  
  return sonnerToast(title || '', { description, ...rest });
}

// Add all the methods from sonner toast to our wrapper
const toast = Object.assign(toastWrapper, {
  // Main toast function
  ...sonnerToast,
  
  // Helper methods with proper typing
  success: (title: string, props?: ToastProps) => {
    return sonnerToast.success(title, props);
  },
  
  error: (title: string, props?: ToastProps) => {
    return sonnerToast.error(title, props);
  },
  
  info: (title: string, props?: ToastProps) => {
    return sonnerToast.info(title, props);
  },
  
  warning: (title: string, props?: ToastProps) => {
    return sonnerToast.warning(title, props);
  },
  
  loading: (title: string, props?: ToastProps) => {
    return sonnerToast.loading(title, props);
  }
});

// Create a useToast hook for compatibility - but don't rely on React.useState
const useToast = () => {
  return { toast };
};

export { toast, useToast };
