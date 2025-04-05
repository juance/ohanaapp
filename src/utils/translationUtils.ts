
import { LaundryOption } from '@/lib/types';

/**
 * Translate laundry options to Spanish
 */
export const translateOption = (option: LaundryOption): string => {
  switch (option) {
    case 'separateByColor': return 'Separar por color';
    case 'delicateDry': return 'Secado en frío';
    case 'stainRemoval': return 'Desmanchar';
    case 'bleach': return 'Blanquear';
    case 'noFragrance': return 'Sin perfume';
    case 'noDry': return 'No secar';
    default: return '';
  }
};
