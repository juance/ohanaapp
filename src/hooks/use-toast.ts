
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

// Export toast functions directly for convenience
export const toast = {
  toast: (title: string, description?: string) => {
    const context = React.useContext(ToastContext);
    if (!context) return;
    context.toast(title, description);
  },
  
  success: (title: string, description?: string) => {
    const context = React.useContext(ToastContext);
    if (!context) return;
    context.success(title, description);
  },
  
  error: (title: string, description?: string) => {
    const context = React.useContext(ToastContext);
    if (!context) return;
    context.error(title, description);
  },
  
  warning: (title: string, description?: string) => {
    const context = React.useContext(ToastContext);
    if (!context) return;
    context.warning(title, description);
  },
  
  info: (title: string, description?: string) => {
    const context = React.useContext(ToastContext);
    if (!context) return;
    context.info(title, description);
  }
};

// Default export for convenience
export default function(title: string, description?: string) {
  const context = React.useContext(ToastContext);
  if (!context) return;
  context.toast(title, description);
}
