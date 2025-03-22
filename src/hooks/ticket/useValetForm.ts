
import { useState } from 'react';
import { LaundryOption } from '@/lib/types';

export const useValetForm = () => {
  // Valet information
  const [valetQuantity, setValetQuantity] = useState(1);
  const [useFreeValet, setUseFreeValet] = useState(false);
  const [showFreeValetDialog, setShowFreeValetDialog] = useState(false);
  
  // Laundry options
  const [separateByColor, setSeparateByColor] = useState(false);
  const [delicateDry, setDelicateDry] = useState(false);
  const [stainRemoval, setStainRemoval] = useState(false);
  const [bleach, setBleach] = useState(false);
  const [noFragrance, setNoFragrance] = useState(false);
  const [noDry, setNoDry] = useState(false);
  
  // Reset valet form data
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
  
  // Collect laundry options
  const getSelectedLaundryOptions = (): LaundryOption[] => {
    const laundryOptions: LaundryOption[] = [];
    if (separateByColor) laundryOptions.push('separateByColor');
    if (delicateDry) laundryOptions.push('delicateDry');
    if (stainRemoval) laundryOptions.push('stainRemoval');
    if (bleach) laundryOptions.push('bleach');
    if (noFragrance) laundryOptions.push('noFragrance');
    if (noDry) laundryOptions.push('noDry');
    return laundryOptions;
  };

  return {
    valetQuantity,
    setValetQuantity,
    useFreeValet,
    setUseFreeValet,
    showFreeValetDialog,
    setShowFreeValetDialog,
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
    resetValetForm,
    getSelectedLaundryOptions
  };
};
