
import { toast } from 'sonner';
import { TicketFormState } from '../types/ticketFormTypes';

export const validateTicketForm = (formState: TicketFormState): boolean => {
  const {
    customerName,
    phoneNumber,
    valetQuantity,
    useFreeValet,
    activeTab,
    selectedDryCleaningItems
  } = formState;
  
  if (!customerName || !phoneNumber) {
    toast.error('Por favor complete los datos del cliente');
    return false;
  }
  
  if (phoneNumber.length < 8) {
    toast.error('Por favor ingrese un número de teléfono válido');
    return false;
  }
  
  if (activeTab === 'valet' && valetQuantity <= 0 && !useFreeValet) {
    toast.error('La cantidad de valets debe ser mayor a cero');
    return false;
  }
  
  if (activeTab === 'tintoreria' && selectedDryCleaningItems.length === 0) {
    toast.error('Por favor seleccione al menos un artículo de tintorería');
    return false;
  }
  
  return true;
};
