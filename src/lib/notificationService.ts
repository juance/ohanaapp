
import { toast } from '@/lib/toast';

export interface NotificationOptions {
  title: string;
  description?: string;
}

export const showNotification = (options: NotificationOptions): void => {
  toast({
    title: options.title,
    description: options.description
  });
};

export const showSuccessNotification = (title: string, description?: string): void => {
  toast({
    title,
    description
  });
};

export const showErrorNotification = (title: string, description?: string): void => {
  toast({
    title,
    description,
    variant: 'destructive'
  });
};

export const showInfoNotification = (title: string, description?: string): void => {
  toast({
    title,
    description
  });
};

export const showWarningNotification = (title: string, description?: string): void => {
  toast({
    title,
    description
  });
};

// Notification for tickets
export const notifyTicketReady = (ticketNumber: string, customerName: string): void => {
  toast({
    title: 'Ticket Listo',
    description: `El ticket ${ticketNumber} de ${customerName} está listo para recoger`
  });
};

export const notifyTicketDelivered = (ticketNumber: string): void => {
  toast({
    title: 'Ticket Entregado',
    description: `El ticket ${ticketNumber} ha sido entregado exitosamente`
  });
};

export const notifyPaymentReceived = (amount: number, method: string): void => {
  const formattedAmount = amount.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS'
  });
  
  toast({
    title: 'Pago Recibido',
    description: `Se recibió un pago de ${formattedAmount} vía ${method}`
  });
};

export const notifyNewCustomer = (customerName: string): void => {
  toast({
    title: 'Nuevo Cliente',
    description: `Se registró un nuevo cliente: ${customerName}`
  });
};

export const getVariant = (type: 'info' | 'success' | 'warning' | 'error') => {
  switch (type) {
    case 'error':
      return 'destructive';
    case 'success':
    case 'info':
    case 'warning':
    default:
      return 'default';
  }
};
