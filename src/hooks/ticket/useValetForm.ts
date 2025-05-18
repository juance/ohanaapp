
import { useState } from 'react';
import { LaundryOption } from '@/lib/types';

export const useValetForm = () => {
  const [valetQuantity, setValetQuantity] = useState<number>(1);
  const [separateByColor, setSeparateByColor] = useState<boolean>(false);
  const [delicateDry, setDelicateDry] = useState<boolean>(false);
  const [stainRemoval, setStainRemoval] = useState<boolean>(false);
  const [bleach, setBleach] = useState<boolean>(false);
  const [noFragrance, setNoFragrance] = useState<boolean>(false);
  const [noDry, setNoDry] = useState<boolean>(false);
  const [useFreeValet, setUseFreeValet] = useState<boolean>(false);

  // Function to reset all valet form values
  const resetValetForm = () => {
    setValetQuantity(1);
    setSeparateByColor(false);
    setDelicateDry(false);
    setStainRemoval(false);
    setBleach(false);
    setNoFragrance(false);
    setNoDry(false);
    setUseFreeValet(false);
  };

  // Function to get all selected laundry options
  const getSelectedLaundryOptions = (): LaundryOption[] => {
    const options: LaundryOption[] = [];
    
    if (separateByColor) {
      options.push({
        name: 'Separar por color',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (delicateDry) {
      options.push({
        name: 'Secado delicado',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (stainRemoval) {
      options.push({
        name: 'Quitar manchas',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (bleach) {
      options.push({
        name: 'Usar lavandina',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (noFragrance) {
      options.push({
        name: 'Sin fragancia',
        optionType: 'preference',
        selected: true
      });
    }
    
    if (noDry) {
      options.push({
        name: 'No secar',
        optionType: 'preference',
        selected: true
      });
    }
    
    return options;
  };

  return {
    valetQuantity,
    setValetQuantity,
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
    useFreeValet,
    setUseFreeValet,
    resetValetForm,
    getSelectedLaundryOptions
  };
};
