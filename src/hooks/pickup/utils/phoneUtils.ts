
/**
 * Format phone number for WhatsApp
 * Strips out non-numeric characters
 */
export const formatPhoneForWhatsApp = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/\D/g, '');
};
