
import { LaundryOption } from '@/lib/types';

/**
 * Translate laundry option names to more user-friendly text
 */
export const translateOption = (option: LaundryOption): string => {
  const translations: { [key: string]: string } = {
    'separateByColor': 'Separar por color',
    'delicateDry': 'Secado delicado',
    'stainRemoval': 'Remover manchas',
    'bleach': 'Usar blanqueador',
    'noFragrance': 'Sin fragancia',
    'noDry': 'No secar'
  };

  return translations[option.name] || option.name;
};
