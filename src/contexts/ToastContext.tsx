
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast';
import { ToastAction } from '@/components/ui/toast';

// Tipos de toast
type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

// Interfaz para los datos del toast
interface ToastData {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Interfaz para el contexto
interface ToastContextType {
  toasts: ToastData[];
  toast: (title?: string, description?: string, type?: ToastType) => void;
  success: (title?: string, description?: string) => void;
  error: (title?: string, description?: string) => void;
  warning: (title?: string, description?: string) => void;
  info: (title?: string, description?: string) => void;
  dismiss: (id: string) => void;
}

// Crear el contexto
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider component
export const ToastContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Función para crear un toast
  const createToast = useCallback((title?: string, description?: string, type: ToastType = 'default', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const newToast: ToastData = {
      id,
      title,
      description,
      type,
      duration,
    };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto dismiss
    if (duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
    
    return id;
  }, []);

  // Helpers para diferentes tipos de toasts
  const toast = useCallback((title?: string, description?: string, type: ToastType = 'default') => {
    return createToast(title, description, type);
  }, [createToast]);
  
  const success = useCallback((title?: string, description?: string) => {
    return createToast(title, description, 'success');
  }, [createToast]);
  
  const error = useCallback((title?: string, description?: string) => {
    return createToast(title, description, 'error');
  }, [createToast]);
  
  const warning = useCallback((title?: string, description?: string) => {
    return createToast(title, description, 'warning');
  }, [createToast]);
  
  const info = useCallback((title?: string, description?: string) => {
    return createToast(title, description, 'info');
  }, [createToast]);

  // Eliminar un toast
  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        toast,
        success,
        error,
        warning,
        info,
        dismiss,
      }}
    >
      {children}
      <ToastProvider>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.type === 'error' ? 'destructive' : 'default'}
            onOpenChange={() => dismiss(toast.id)}
          >
            {toast.title && <div className="font-semibold">{toast.title}</div>}
            {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
            {toast.action && (
              <ToastAction altText="Action" onClick={toast.action.onClick}>
                {toast.action.label}
              </ToastAction>
            )}
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
};

// Hook para usar el contexto
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastContextProvider');
  }
  
  // Para mantener compatibilidad con la API anterior
  const compatibleToast = Object.assign(context.toast, {
    success: context.success,
    error: context.error,
    warning: context.warning,
    info: context.info,
  });
  
  return { toast: compatibleToast };
};

// Exportamos el toast directamente para facilitar el uso
export const toast = Object.assign(
  (title?: string, description?: string, type: ToastType = 'default') => {
    const context = useContext(ToastContext);
    if (context) {
      return context.toast(title, description, type);
    }
  },
  {
    success: (title?: string, description?: string) => {
      const context = useContext(ToastContext);
      if (context) return context.success(title, description);
    },
    error: (title?: string, description?: string) => {
      const context = useContext(ToastContext);
      if (context) return context.error(title, description);
    },
    warning: (title?: string, description?: string) => {
      const context = useContext(ToastContext);
      if (context) return context.warning(title, description);
    },
    info: (title?: string, description?: string) => {
      const context = useContext(ToastContext);
      if (context) return context.info(title, description);
    },
  }
);
