
import { useState, useCallback } from 'react';
import { toast } from '@/lib/toast';
import { LaundryOption } from '@/lib/types';

export const useValetForm = () => {
  const [valetQuantity, setValetQuantity] = useState<number>(1);
  const [pricePerValet, setPricePerValet] = useState<number>(200);
  const [useFreeValet, setUseFreeValet] = useState(false);
  const [showFreeValetDialog, setShowFreeValetDialog] = useState(false);
  
  // Laundry options state
  const [separateByColor, setSeparateByColor] = useState<boolean>(false);
  const [delicateDry, setDelicateDry] = useState<boolean>(false);
  const [stainRemoval, setStainRemoval] = useState<boolean>(false);
  const [bleach, setBleach] = useState<boolean>(false);
  const [noFragrance, setNoFragrance] = useState<boolean>(false);
  const [noDry, setNoDry] = useState<boolean>(false);

  // Handle quantity change
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setValetQuantity(value);
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
    return useFreeValet ? 0 : valetQuantity * pricePerValet;
  }, [valetQuantity, pricePerValet, useFreeValet]);

  // Reset form
  const resetValetForm = () => {
    setValetQuantity(1);
    setPricePerValet(200);
    setUseFreeValet(false);
    setShowFreeValetDialog(false);
    setSeparateByColor(false);
    setDelicateDry(false);
    setStainRemoval(false);
    setBleach(false);
    setNoFragrance(false);
    setNoDry(false);
  };

  // Get selected laundry options
  const getSelectedLaundryOptions = (): LaundryOption[] => {
    const options: LaundryOption[] = [];
    
    if (separateByColor) {
      options.push({ id: 'separate_color', name: 'Separar por color', optionType: 'washing', option_type: 'washing' });
    }
    
    if (delicateDry) {
      options.push({ id: 'delicate_dry', name: 'Secado delicado', optionType: 'drying', option_type: 'drying' });
    }
    
    if (stainRemoval) {
      options.push({ id: 'stain_removal', name: 'Quitar manchas', optionType: 'treatment', option_type: 'treatment' });
    }
    
    if (bleach) {
      options.push({ id: 'bleach', name: 'Usar blanqueador', optionType: 'treatment', option_type: 'treatment' });
    }
    
    if (noFragrance) {
      options.push({ id: 'no_fragrance', name: 'Sin fragancia', optionType: 'fragance', option_type: 'fragance' });
    }
    
    if (noDry) {
      options.push({ id: 'no_dry', name: 'Sin secado', optionType: 'drying', option_type: 'drying' });
    }
    
    return options;
  };

  return {
    valetQuantity,
    pricePerValet,
    useFreeValet,
    showFreeValetDialog,
    setValetQuantity,
    setUseFreeValet,
    setShowFreeValetDialog,
    handleQuantityChange,
    handlePriceChange,
    calculateTotalPrice,
    resetValetForm,
    getSelectedLaundryOptions,
    // Return laundry options state
    separateByColor,
    setSeparateByColor,
    delicateDry,
    setDelicateDry,
    stainRemoval,
    setStainRemoval,
    bleach,
    setBleach,
    noFragrance,
    setNoFragrance,
    noDry,
    setNoDry
  };
};
