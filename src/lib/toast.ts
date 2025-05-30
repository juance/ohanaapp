
interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export type ToastOptions = ToastProps;

export const toast = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    console.log('Toast:', props);
    return;
  }
  
  const { title, description, variant = 'default' } = props;
  console.log(`Toast [${variant}]:`, title, description);
  
  // En una implementación real, esto sería conectado a un sistema de toasts
  // Por ahora solo logueamos a la consola
};

// Métodos de conveniencia
toast.success = (message: string) => toast({ title: 'Éxito', description: message });
toast.error = (message: string) => toast({ title: 'Error', description: message, variant: 'destructive' });
toast.info = (message: string) => toast({ title: 'Info', description: message });
toast.warning = (message: string) => toast({ title: 'Advertencia', description: message });
