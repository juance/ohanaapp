
import { toast } from '@/lib/toast';

export const useFormValidation = () => {
  const validateClientInfo = (clientName: string, phoneNumber: string) => {
    if (!clientName.trim()) {
      toast.error('Please enter a client name');
      return false;
    }

    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return false;
    }
    
    return true;
  };

  const validateServices = (selectedServices: string[], selectedDryCleaningItems: {id: string, quantity: number}[]) => {
    if (selectedServices.length === 0 && selectedDryCleaningItems.length === 0) {
      toast.error('Please select at least one service or dry cleaning item');
      return false;
    }
    
    return true;
  };

  return {
    validateClientInfo,
    validateServices
  };
};
