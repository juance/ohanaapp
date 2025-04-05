
import { toast } from '@/lib/toast';
import { Customer } from '@/lib/types';
import { getCustomerByPhone } from '@/lib/dataService';

export const useCustomerLookup = (
  setCustomerName: (name: string) => void,
  setPhoneNumber: (phone: string) => void,
  setFoundCustomer: (customer: Customer | null) => void,
  setUseFreeValet: (useFree: boolean) => void,
  setShowFreeValetDialog: (show: boolean) => void,
  activeTab: string
) => {
  const handleCustomerLookup = async (lookupPhone: string) => {
    if (!lookupPhone || lookupPhone.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Por favor ingrese un número de teléfono válido'
      });
      return;
    }

    try {
      const customer = await getCustomerByPhone(lookupPhone);

      if (customer) {
        setCustomerName(customer.name);
        setPhoneNumber(customer.phoneNumber);
        setFoundCustomer(customer);

        // Si el cliente tiene valets gratis, mostrar la opción
        if (customer.freeValets > 0 && activeTab === 'valet') {
          setShowFreeValetDialog(true);
        } else {
          setUseFreeValet(false);
          toast({
            title: "Success",
            description: `Cliente encontrado: ${customer.name}`
          });
        }
      } else {
        setFoundCustomer(null);
        setUseFreeValet(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: 'Cliente no encontrado'
        });
      }
    } catch (error) {
      console.error('Error looking up customer:', error);
      setFoundCustomer(null);
      setUseFreeValet(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Error al buscar cliente'
      });
    }
  };

  return { handleCustomerLookup };
};
