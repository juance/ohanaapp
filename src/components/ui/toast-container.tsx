
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
      const id = Date.now().toString();
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
    <div className="fixed top-0 right-0 p-4 space-y-2 z-50">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
