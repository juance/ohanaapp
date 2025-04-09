
import { toast } from '@/lib/toast';

/**
 * Validate ticket form input before submission
 */
export const validateTicketInput = (
  customerName: string,
  phoneNumber: string,
  activeTab: string,
  valetQuantity: number,
  useFreeValet: boolean,
  selectedDryCleaningItems: any[]
): boolean => {
  // Validate customer information
  if (!customerName || !phoneNumber) {
    toast.error('Por favor complete los datos del cliente');
    return false;
  }
  
  if (phoneNumber.length < 8) {
    toast.error('Por favor ingrese un número de teléfono válido');
    return false;
  }
  
  // Validate valet quantity
  if (activeTab === 'valet' && valetQuantity <= 0 && !useFreeValet) {
    toast.error('La cantidad de valets debe ser mayor a cero');
    return false;
  }
  
  // Validate dry cleaning items
  if (activeTab === 'tintoreria' && selectedDryCleaningItems.length === 0) {
    toast.error('Por favor seleccione al menos un artículo de tintorería');
    return false;
  }
  
  return true;
};
