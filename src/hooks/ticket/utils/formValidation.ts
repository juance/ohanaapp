
import { toast } from '@/components/ui/use-toast';
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
    toast({
      variant: "destructive",
      title: "Error",
      description: 'Por favor complete los datos del cliente'
    });
    return false;
  }
  
  if (phoneNumber.length < 8) {
    toast({
      variant: "destructive",
      title: "Error",
      description: 'Por favor ingrese un número de teléfono válido'
    });
    return false;
  }
  
  if (activeTab === 'valet' && valetQuantity <= 0 && !useFreeValet) {
    toast({
      variant: "destructive",
      title: "Error",
      description: 'La cantidad de valets debe ser mayor a cero'
    });
    return false;
  }
  
  if (activeTab === 'tintoreria' && selectedDryCleaningItems.length === 0) {
    toast({
      variant: "destructive",
      title: "Error",
      description: 'Por favor seleccione al menos un artículo de tintorería'
    });
    return false;
  }
  
  return true;
};
