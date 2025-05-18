
import { useState } from 'react';
import { LaundryOption } from '@/lib/types/ticket.types';

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

  // Get the selected laundry options
  const getSelectedLaundryOptions = (): LaundryOption[] => {
    const options: LaundryOption[] = [];
    
    if (separateByColor) {
      options.push({
        id: String(Math.random()),
        name: 'Separar por color',
        optionType: 'preference'
      });
    }
    
    if (delicateDry) {
      options.push({
        id: String(Math.random()),
        name: 'Secado delicado',
        optionType: 'preference'
      });
    }
    
    if (stainRemoval) {
      options.push({
        id: String(Math.random()),
        name: 'Remoción de manchas',
        optionType: 'preference'
      });
    }
    
    if (bleach) {
      options.push({
        id: String(Math.random()),
        name: 'Blanqueador',
        optionType: 'preference'
      });
    }
    
    if (noFragrance) {
      options.push({
        id: String(Math.random()),
        name: 'Sin fragancia',
        optionType: 'preference'
      });
    }
    
    if (noDry) {
      options.push({
        id: String(Math.random()),
        name: 'Sin secado',
        optionType: 'preference'
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
