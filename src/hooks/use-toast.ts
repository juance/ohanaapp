
// Importamos directamente la función toast de sonner
import { toast } from "sonner";

// Exportamos la función toast para uso directo
export { toast };

// Simple función para mantener compatibilidad con la API anterior
export function useToast() {
  return {
    toast
  };
}
