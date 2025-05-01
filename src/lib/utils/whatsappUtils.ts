
/**
 * Opens WhatsApp with a predefined message for the given phone number
 * 
 * @param phoneNumber The phone number to send the message to
 * @param message The message to send
 */
export const openWhatsApp = (phoneNumber: string, message: string): void => {
  // Clean phone number (remove non-numeric characters)
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
  
  // Ensure phone number has country code (add Argentina +54 if not present)
  let formattedPhone = cleanPhoneNumber;
  if (!formattedPhone.startsWith('54') && !formattedPhone.startsWith('549')) {
    formattedPhone = '549' + formattedPhone;
  }
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create the WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  // Open WhatsApp in new tab
  window.open(whatsappUrl, '_blank');
};

/**
 * Formats a phone number for display
 * 
 * @param phoneNumber The raw phone number
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Clean phone number
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format for Argentina standard (11 1234-5678)
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  
  // Return original if can't format
  return phoneNumber;
};

/**
 * Checks if a phone number is valid (has minimum digits)
 * 
 * @param phoneNumber The phone number to validate
 * @returns Boolean indicating if phone is valid
 */
export const isValidPhone = (phoneNumber: string): boolean => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned.length >= 8;
};
