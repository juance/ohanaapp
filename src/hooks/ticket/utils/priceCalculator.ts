
import { SelectedDryCleaningItem } from '@/components/ticket-form/types';
import { dryCleaningItems } from '@/components/DryCleaningOptions';

/**
 * Calculate ticket price based on the active service tab and selections
 */
export const calculateTicketPrice = (
  activeTab: string,
  valetQuantity: number,
  useFreeValet: boolean,
  selectedDryCleaningItems: SelectedDryCleaningItem[]
): number => {
  // Base price per valet (updated to 5000)
  const basePrice = 5000;
  let calculatedPrice = 0;
  
  if (activeTab === 'valet') {
    // If using a free valet, price is 0
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
  
  return calculatedPrice;
};
