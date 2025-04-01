
/**
 * Formats a phone number to ensure it starts with +549 (Argentina format)
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Formato de teléfono Argentina: asegurar que comience con +549
  if (!phoneNumber.startsWith('+549')) {
    // Si el número ya tiene + al inicio, reemplazarlo
    if (phoneNumber.startsWith('+')) {
      return '+549' + phoneNumber.substring(1);
    } 
    // Si no tiene + al inicio, simplemente agregar +549
    else {
      return '+549' + phoneNumber;
    }
  }
  return phoneNumber;
};
