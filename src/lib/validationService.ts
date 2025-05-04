
import { ErrorLevel } from './types/error.types';
import { toast } from './toast';

/**
 * Validates a form field and shows a toast message if invalid
 * @param field Field name
 * @param value Field value
 * @param type Validation type (e.g. 'required', 'email', 'phone', etc.)
 * @returns Whether the field is valid
 */
export function validateField(field: string, value: any, type: string): boolean {
  const errorLevel: ErrorLevel = ErrorLevel.WARNING;
  
  if (type === 'required' && (!value || value === '')) {
    toast.error(`El campo ${field} es obligatorio`);
    return false;
  }

  if (type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
    toast.error(`El correo electrónico no es válido`);
    return false;
  }

  if (type === 'phone' && value && !/^\+?[0-9]{8,15}$/.test(value.replace(/\D/g, ''))) {
    toast.error(`El número de teléfono no es válido`);
    return false;
  }

  return true;
}

/**
 * Validates a form and shows toast messages for invalid fields
 * @param form Form data object
 * @param validations Validation rules
 * @returns Whether the form is valid
 */
export function validateForm(form: Record<string, any>, validations: Record<string, string>): boolean {
  let isValid = true;

  for (const [field, rule] of Object.entries(validations)) {
    const isFieldValid = validateField(field, form[field], rule);
    if (!isFieldValid) {
      isValid = false;
    }
  }

  return isValid;
}
