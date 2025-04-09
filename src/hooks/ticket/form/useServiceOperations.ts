
export const useServiceOperations = (
  setSelectedServices: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedDryCleaningItems: React.Dispatch<React.SetStateAction<{id: string, quantity: number}[]>>,
  setSelectedLaundryOptions: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleDryCleaningToggle = (itemId: string) => {
    setSelectedDryCleaningItems(prev => {
      const existingItem = prev.find(item => item.id === itemId);

      if (existingItem) {
        // Remove the item
        return prev.filter(item => item.id !== itemId);
      } else {
        // Add the item with quantity 1
        return [...prev, { id: itemId, quantity: 1 }];
      }
    });
  };

  const handleDryCleaningQuantityChange = (itemId: string, quantity: number) => {
    setSelectedDryCleaningItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleLaundryOptionToggle = (optionId: string) => {
    setSelectedLaundryOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  return {
    handleServiceToggle,
    handleDryCleaningToggle,
    handleDryCleaningQuantityChange,
    handleLaundryOptionToggle
  };
};
