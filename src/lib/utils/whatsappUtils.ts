
/**
 * Utilities for WhatsApp integration
 */

/**
 * Creates a WhatsApp message link with prefilled text
 * @param phoneNumber Phone number without country code
 * @param message Optional prefilled message
 * @returns WhatsApp URL that can be used in href
 */
export const createWhatsAppLink = (phoneNumber: string, message?: string): string => {
  // Format phone number: remove spaces, dashes, and add country code if not present
  const formattedPhone = formatPhoneNumber(phoneNumber);
  
  // Build the WhatsApp URL
  let url = `https://wa.me/${formattedPhone}`;
  
  // Add message if provided
  if (message && message.trim()) {
    const encodedMessage = encodeURIComponent(message.trim());
    url += `?text=${encodedMessage}`;
  }
  
  return url;
};

/**
 * Format phone number for WhatsApp link
 * Adds Argentina country code (54) if not present
 * Removes spaces, dashes and other non-numeric characters
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Add Argentina country code if not present
  if (!cleaned.startsWith('54') && cleaned.length <= 10) {
    cleaned = `54${cleaned}`;
  }
  
  return cleaned;
};

/**
 * Create a WhatsApp link with a ticket ready message
 * @param phoneNumber Customer phone number
 * @param ticketNumber The ticket number
 * @returns WhatsApp URL with prefilled message
 */
export const createTicketReadyMessage = (phoneNumber: string, ticketNumber: string): string => {
  const message = `Hola! Tu ropa ya está lista para retirar. Ticket #${ticketNumber}. Gracias por confiar en nosotros!`;
  return createWhatsAppLink(phoneNumber, message);
};

/**
 * Open WhatsApp with a prefilled message in a new tab
 * @param phoneNumber Customer phone number
 * @param message Message to send
 */
export const openWhatsApp = (phoneNumber: string, message?: string): void => {
  const url = createWhatsAppLink(phoneNumber, message);
  window.open(url, '_blank');
};
