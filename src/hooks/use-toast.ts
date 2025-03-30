
// Importamos la función toast directamente de sonner
import { toast as sonnerToast } from "sonner";

// Creamos un objeto toast personalizado para evitar conflictos
// y proporcionar una interfaz consistente sin usar hooks de React
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

// Proporcionamos una función para compatibilidad con código existente
// pero no usa ningún hook de React
export function useToast() {
  return { toast };
}
