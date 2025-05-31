
import React, { useState, useEffect } from 'react';
import { ToastNotification } from './toast-notification';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

let toastContainer: ((toast: Omit<Toast, 'id'>) => void) | null = null;

export const showToast = (toast: Omit<Toast, 'id'>) => {
  if (toastContainer) {
    toastContainer(toast);
  }
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastContainer = (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts(prev => [...prev, { ...toast, id }]);
    };

    return () => {
      toastContainer = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastNotification
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};
