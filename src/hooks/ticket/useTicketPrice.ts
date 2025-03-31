
import { useEffect } from 'react';
import { SelectedDryCleaningItem } from '@/components/ticket-form/types';
import { calculateTicketPrice } from './utils/priceCalculator';

/**
 * Hook that calculates and updates ticket price based on service selections
 */
export const useTicketPrice = (
  activeTab: string,
  valetQuantity: number,
  useFreeValet: boolean,
  selectedDryCleaningItems: SelectedDryCleaningItem[],
  setTotalPrice: (price: number) => void
) => {
  useEffect(() => {
    const price = calculateTicketPrice(
      activeTab,
      valetQuantity,
      useFreeValet,
      selectedDryCleaningItems
    );
    
    setTotalPrice(price);
  }, [activeTab, valetQuantity, useFreeValet, selectedDryCleaningItems, setTotalPrice]);
};
