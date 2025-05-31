
import { showToast } from '@/components/ui/toast-container';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export type ToastOptions = ToastProps;

export const toast = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    showToast({
      title: props,
      variant: 'default'
    });
    return;
  }
  
  const { title = '', description, variant = 'default' } = props;
  showToast({
    title,
    description,
    variant
  });
};

// Métodos de conveniencia
toast.success = (message: string, description?: string) => {
  showToast({
    title: message,
    description,
    variant: 'success'
  });
};

toast.error = (message: string, description?: string) => {
  showToast({
    title: message,
    description,
    variant: 'destructive'
  });
};

toast.info = (message: string, description?: string) => {
  showToast({
    title: message,
    description,
    variant: 'default'
  });
};

toast.warning = (message: string, description?: string) => {
  showToast({
    title: message,
    description,
    variant: 'default'
  });
};
