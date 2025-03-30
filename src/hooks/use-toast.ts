
// Importamos directamente la función toast de sonner
import { toast as sonnerToast } from "sonner";

// Creamos una función wrapper para evitar conflictos
export const toast = sonnerToast;

// Función para mantener compatibilidad con la API anterior
export function useToast() {
  return {
    toast: sonnerToast
  };
}
