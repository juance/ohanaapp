
// Importamos la función toast directamente de sonner
import { toast as sonnerToast } from "sonner";

// Creamos una función toast personalizada para evitar conflictos
// y proporcionar una interfaz consistente
export const toast = {
  // Tipos básicos de toast
  info: (message: string, options?: any) => 
    sonnerToast.info(message, options),
  
  success: (message: string, options?: any) => 
    sonnerToast.success(message, options),
  
  warning: (message: string, options?: any) => 
    sonnerToast.warning(message, options),
  
  error: (message: string, options?: any) => 
    sonnerToast.error(message, options),
  
  // Toast predeterminado
  default: (message: string, options?: any) => 
    sonnerToast(message, options),
  
  // Permitir acceso directo a la función original
  raw: sonnerToast
};

// Exportamos una función que devuelve el objeto toast
// Esta no usa hooks de React en absoluto
export function useToast() {
  return { toast };
}
