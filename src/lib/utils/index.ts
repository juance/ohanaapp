// Add formatDate to the utils
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(dateString: string, formatStr: string = 'dd/MM/yyyy') {
  if (!dateString) return '';
  
  try {
    return format(new Date(dateString), formatStr, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}
