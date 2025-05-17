
/**
 * Opens WhatsApp with a pre-filled message for the given phone number
 * 
 * @param phoneNumber The phone number to send the message to
 * @param message The message to pre-fill
 */
export function openWhatsApp(phoneNumber: string, message: string): void {
  // Format phone number (remove spaces, dashes, etc.)
  const formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  // Open WhatsApp in a new window
  window.open(whatsappUrl, '_blank');
}
