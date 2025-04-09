
import { DryCleaningItem } from '@/lib/types';

export const usePriceCalculation = () => {
  const calculateTotal = (
    selectedServices: string[], 
    selectedDryCleaningItems: {id: string, quantity: number}[],
    laundryServices: { id: string, name: string, price: number }[],
    dryCleaningOptions: { id: string, name: string, price: number }[]
  ) => {
    // Calculate total for regular services
    const servicesTotal = selectedServices.reduce((total, serviceId) => {
      const service = laundryServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);

    // Calculate total for dry cleaning items
    const dryCleaningTotal = selectedDryCleaningItems.reduce((total, item) => {
      const dryCleaningItem = dryCleaningOptions.find(dci => dci.id === item.id);
      return total + ((dryCleaningItem?.price || 0) * item.quantity);
    }, 0);

    return servicesTotal + dryCleaningTotal;
  };

  return {
    calculateTotal
  };
};
