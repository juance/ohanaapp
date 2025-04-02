
import { useEffect } from 'react';
import { SelectedDryCleaningItem } from '@/components/DryCleaningOptions';
import { dryCleaningItems } from '@/components/DryCleaningOptions';

export const useTicketPrice = (
  activeTab: string,
  valetQuantity: number,
  useFreeValet: boolean,
  selectedDryCleaningItems: SelectedDryCleaningItem[],
  setTotalPrice: (price: number) => void
) => {
  useEffect(() => {
    // Base price per valet (updated to 5000)
    const basePrice = 5000;
    let calculatedPrice = 0;
    
    if (activeTab === 'valet') {
      // Si se está usando un valet gratis, el precio es 0
      if (useFreeValet) {
        calculatedPrice = 0;
      } else {
        calculatedPrice = basePrice * valetQuantity;
      }
    } else if (activeTab === 'tintoreria') {
      // Calculate dry cleaning total
      calculatedPrice = selectedDryCleaningItems.reduce((total, item) => {
        const itemDetails = dryCleaningItems.find(dci => dci.id === item.id);
        return total + ((itemDetails?.price || 0) * item.quantity);
      }, 0);
    }
    
    setTotalPrice(calculatedPrice);
  }, [valetQuantity, selectedDryCleaningItems, activeTab, useFreeValet, setTotalPrice]);
};
