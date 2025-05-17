
import { useState } from 'react';
import { LaundryOption } from '@/lib/types';

export const useValetForm = () => {
  // Valet quantity and options
  const [valetQuantity, setValetQuantity] = useState<number>(1);
  const [pricePerValet] = useState<number>(6000);
  
  // Free valet state
  const [useFreeValet, setUseFreeValet] = useState<boolean>(false);
  const [showFreeValetDialog, setShowFreeValetDialog] = useState<boolean>(false);

  // Laundry options
  const [separateByColor, setSeparateByColor] = useState<boolean>(false);
  const [delicateDry, setDelicateDry] = useState<boolean>(false);
  const [stainRemoval, setStainRemoval] = useState<boolean>(false);
  const [bleach, setBleach] = useState<boolean>(false);
  const [noFragrance, setNoFragrance] = useState<boolean>(false);
  const [noDry, setNoDry] = useState<boolean>(false);

  // Get selected laundry options
  const getSelectedLaundryOptions = (): LaundryOption[] => {
    const options: LaundryOption[] = [];
    
    if (separateByColor) {
      options.push({
        id: Math.random().toString(36).substring(2, 9),
        name: 'Separar por color',
        optionType: 'preference',
        type: 'preference' // Added for backward compatibility
      });
    }
    
    if (delicateDry) {
      options.push({
        id: Math.random().toString(36).substring(2, 9),
        name: 'Secado delicado',
        optionType: 'drying',
        type: 'drying' // Added for backward compatibility
      });
    }
    
    if (stainRemoval) {
      options.push({
        id: Math.random().toString(36).substring(2, 9),
        name: 'Quitar manchas',
        optionType: 'cleaning',
        type: 'cleaning' // Added for backward compatibility
      });
    }
    
    if (bleach) {
      options.push({
        id: Math.random().toString(36).substring(2, 9),
        name: 'Usar lavandina',
        optionType: 'cleaning',
        type: 'cleaning' // Added for backward compatibility
      });
    }
    
    if (noFragrance) {
      options.push({
        id: Math.random().toString(36).substring(2, 9),
        name: 'Sin fragancia',
        optionType: 'preference',
        type: 'preference' // Added for backward compatibility
      });
    }
    
    if (noDry) {
      options.push({
        id: Math.random().toString(36).substring(2, 9),
        name: 'No secar',
        optionType: 'drying',
        type: 'drying' // Added for backward compatibility
      });
    }
    
    return options;
  };

  const resetValetForm = () => {
    setValetQuantity(1);
    setUseFreeValet(false);
    setShowFreeValetDialog(false);
    setSeparateByColor(false);
    setDelicateDry(false);
    setStainRemoval(false);
    setBleach(false);
    setNoFragrance(false);
    setNoDry(false);
  };

  return {
    // Valet specific state
    valetQuantity,
    setValetQuantity,
    pricePerValet,
    useFreeValet,
    setUseFreeValet,
    showFreeValetDialog,
    setShowFreeValetDialog,
    
    // Laundry options
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
    setNoDry,
    
    // Functions
    getSelectedLaundryOptions,
    resetValetForm
  };
};
