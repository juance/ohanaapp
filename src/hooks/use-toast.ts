
import React from 'react';
import { useContext } from 'react';
import { ToastContext } from '@/contexts/ToastContext';

// Create a custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastContextProvider');
  }
  
  return context;
};

// Export toast function directly for convenience
export const toast = {
  // Default toast with optional description
  (title: string, description?: string) {
    const context = React.useContext(ToastContext);
    if (context) context.toast(title, description);
    return;
  },
  
  // Success toast
  success: (title: string, description?: string) => {
    const context = React.useContext(ToastContext);
    if (context) context.success(title, description);
  },
  
  // Error toast
  error: (title: string, description?: string) => {
    const context = React.useContext(ToastContext);
    if (context) context.error(title, description);
  },
  
  // Warning toast
  warning: (title: string, description?: string) => {
    const context = React.useContext(ToastContext);
    if (context) context.warning(title, description);
  },
  
  // Info toast
  info: (title: string, description?: string) => {
    const context = React.useContext(ToastContext);
    if (context) context.info(title, description);
  }
};
