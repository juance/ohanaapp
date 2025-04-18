
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
    if (separateByColor) laundryOptions.push({ id: 'separateByColor', name: 'Separar por color', price: 0 });
    if (delicateDry) laundryOptions.push({ id: 'delicateDry', name: 'Secado delicado', price: 0 });
    if (stainRemoval) laundryOptions.push({ id: 'stainRemoval', name: 'Quitar manchas', price: 0 });
    if (bleach) laundryOptions.push({ id: 'bleach', name: 'Usar blanqueador', price: 0 });
    if (noFragrance) laundryOptions.push({ id: 'noFragrance', name: 'Sin perfume', price: 0 });
    if (noDry) laundryOptions.push({ id: 'noDry', name: 'Sin secado', price: 0 });
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
