
import { useState, useCallback } from 'react';
import { toast } from '@/lib/toast';
import { LaundryOption } from '@/lib/types';

export const useValetForm = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerValet, setPricePerValet] = useState<number>(200);
  const [useFreeValet, setUseFreeValet] = useState(false);
  const [showFreeValetDialog, setShowFreeValetDialog] = useState(false);

  // Handle quantity change
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      toast.error('La cantidad debe ser un número mayor a cero');
    }
  };

  // Handle price per valet change
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setPricePerValet(value);
    } else {
      toast.error('El precio debe ser un número mayor o igual a cero');
    }
  };

  // Calculate total price
  const calculateTotalPrice = useCallback(() => {
    return useFreeValet ? 0 : quantity * pricePerValet;
  }, [quantity, pricePerValet, useFreeValet]);

  // Reset form
  const resetValetForm = () => {
    setQuantity(1);
    setPricePerValet(200);
    setUseFreeValet(false);
    setShowFreeValetDialog(false);
  };

  // Get selected laundry options
  const getSelectedLaundryOptions = (): LaundryOption[] => {
    return [
      { id: 'soft_fragrance', name: 'Fragancia suave', optionType: 'fragance', option_type: 'fragance' },
      { id: 'strong_fragrance', name: 'Fragancia intensa', optionType: 'fragance', option_type: 'fragance' },
      { id: 'no_fragrance', name: 'Sin fragancia', optionType: 'fragance', option_type: 'fragance' },
      { id: 'normal_ironing', name: 'Planchado normal', optionType: 'iron', option_type: 'iron' },
      { id: 'special_ironing', name: 'Planchado especial', optionType: 'iron', option_type: 'iron' },
      { id: 'no_ironing', name: 'Sin planchar', optionType: 'iron', option_type: 'iron' }
    ].filter(option => useFreeValet); // Only add options if using the service
  };

  return {
    quantity,
    pricePerValet,
    useFreeValet,
    showFreeValetDialog,
    setUseFreeValet,
    setShowFreeValetDialog,
    handleQuantityChange,
    handlePriceChange,
    calculateTotalPrice,
    resetValetForm,
    getSelectedLaundryOptions
  };
};
