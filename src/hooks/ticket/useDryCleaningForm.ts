
import { useState } from 'react';
import { SelectedDryCleaningItem } from '@/components/ticket-form/types';

export const useDryCleaningForm = () => {
  // Dry cleaning items
  const [selectedDryCleaningItems, setSelectedDryCleaningItems] = useState<SelectedDryCleaningItem[]>([]);
  
  // Reset dry cleaning form data
  const resetDryCleaningForm = () => {
    setSelectedDryCleaningItems([]);
  };

  return {
    selectedDryCleaningItems,
    setSelectedDryCleaningItems,
    resetDryCleaningForm
  };
};
