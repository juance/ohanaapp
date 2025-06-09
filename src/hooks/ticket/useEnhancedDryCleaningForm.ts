
import { useState, useCallback } from 'react';
import { SelectedService } from '@/components/ticket/services/DryCleaningServiceCard';

export const useEnhancedDryCleaningForm = () => {
  const [selectedDryCleaningItems, setSelectedDryCleaningItems] = useState<SelectedService[]>([]);

  const updateSelectedItems = useCallback((items: SelectedService[]) => {
    console.log('Updating selected dry cleaning items:', items);
    setSelectedDryCleaningItems(items);
  }, []);

  const resetDryCleaningForm = useCallback(() => {
    setSelectedDryCleaningItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return selectedDryCleaningItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [selectedDryCleaningItems]);

  const getTotalItems = useCallback(() => {
    return selectedDryCleaningItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }, [selectedDryCleaningItems]);

  return {
    selectedDryCleaningItems,
    setSelectedDryCleaningItems: updateSelectedItems,
    resetDryCleaningForm,
    getTotalPrice,
    getTotalItems
  };
};
