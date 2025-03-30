
// Importación directa de la API de toast de sonner
import { toast as sonnerToast } from "sonner";

// Objeto de toast que puede ser importado en cualquier lugar sin hooks
export const toast = {
  info: (message: string, options?: any) => 
    sonnerToast.info(message, options),
  
  success: (message: string, options?: any) => 
    sonnerToast.success(message, options),
  
  warning: (message: string, options?: any) => 
    sonnerToast.warning(message, options),
  
  error: (message: string, options?: any) => 
    sonnerToast.error(message, options),
  
  default: (message: string, options?: any) => 
    sonnerToast(message, options),
  
  raw: sonnerToast
};

// Función auxiliar que no usa ningún hook de React
export function useToast() {
  return { toast };
}
