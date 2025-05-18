
import { useState } from 'react';
import { LaundryOption } from '@/lib/types';

export const useValetForm = () => {
  const [valetQuantity, setValetQuantity] = useState<number>(1);
  const [useFreeValet, setUseFreeValet] = useState<boolean>(false);
  
  // Laundry options state
  const [separateByColor, setSeparateByColor] = useState<boolean>(false);
  const [delicateDry, setDelicateDry] = useState<boolean>(false);
  const [stainRemoval, setStainRemoval] = useState<boolean>(false);
  const [bleach, setBleach] = useState<boolean>(false);
  const [noFragrance, setNoFragrance] = useState<boolean>(false);
  const [noDry, setNoDry] = useState<boolean>(false);

  // Get selected laundry options in array format
  const getSelectedLaundryOptions = (): LaundryOption[] => {
    const options: LaundryOption[] = [];
    
    if (separateByColor) {
      options.push({
        id: 'color',
        name: 'Separar por color',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (delicateDry) {
      options.push({
        id: 'delicate',
        name: 'Secado delicado',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (stainRemoval) {
      options.push({
        id: 'stain',
        name: 'Quitar manchas',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (bleach) {
      options.push({
        id: 'bleach',
        name: 'Usar blanqueador',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (noFragrance) {
      options.push({
        id: 'no-fragrance',
        name: 'Sin fragancia',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (noDry) {
      options.push({
        id: 'no-dry',
        name: 'Sin secar',
        optionType: 'preference',
        selected: true
      });
    }
    
    return options;
  };

  const resetValetForm = () => {
    setValetQuantity(1);
    setUseFreeValet(false);
    setSeparateByColor(false);
    setDelicateDry(false);
    setStainRemoval(false);
    setBleach(false);
    setNoFragrance(false);
    setNoDry(false);
  };

  return {
    valetQuantity,
    setValetQuantity,
    useFreeValet,
    setUseFreeValet,
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
    getSelectedLaundryOptions,
    resetValetForm
  };
};
