
import { LaundryOption } from '@/lib/types';

// Utility function to translate LaundryOption to Spanish
export const translateOption = (option: LaundryOption | string): string => {
  const optionId = typeof option === 'string' ? option : option.id || option.name || '';
  
  switch (optionId) {
    case 'separateByColor':
      return 'Separar por color';
    case 'delicateDry':
      return 'Secado delicado';
    case 'stainRemoval':
      return 'Quitar manchas';
    case 'bleach':
      return 'Usar blanqueador';
    case 'noFragrance':
      return 'Sin perfume';
    case 'noDry':
      return 'Sin secado';
    default:
      return optionId;
  }
};
