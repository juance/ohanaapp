
import { toast as sonnerToast } from 'sonner';
import type { ExternalToast } from 'sonner';

// Exportamos directamente el toast de sonner para un uso más sencillo
export const toast = sonnerToast;

// Hook simple para mantener compatibilidad con código existente
export const useToast = () => {
  return {
    toast: sonnerToast
  };
};
