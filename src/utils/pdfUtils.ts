
import { jsPDF } from 'jspdf';
import { Ticket, LaundryOption } from '@/lib/types';
import { translateOption } from './translationUtils';

/**
 * Generates a PDF for a ticket
 * @param ticket The ticket data
 * @param selectedOptions Additional laundry options
 * @returns A base64 encoded string of the PDF
 */
export const generateTicketPDF = (ticket: Ticket, selectedOptions: LaundryOption[] = []): string => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a6' // Small receipt size
  });

  // Set font
  doc.setFont('helvetica', 'normal');
  
  // Header
  doc.setFontSize(16);
  doc.text('Ohana', 105, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Lavandería - Tintorería', 105, 15, { align: 'center' });
  doc.text('Camargo 590 | CABA | 11 3642 4871', 105, 20, { align: 'center' });
  
  // Divider
  doc.line(10, 25, 200, 25);
  
  // Ticket info
  doc.setFontSize(10);
  let y = 30;
  const leftMargin = 10;
  
  // Format date
  const date = new Date(ticket.createdAt);
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  
  // Ticket details
  doc.text(`Ticket Número: ${ticket.ticketNumber || 'N/A'}`, leftMargin, y);
  y += 7;
  doc.text(`N° Canasto: ${ticket.basketTicketNumber || 'N/A'}`, leftMargin, y);
  y += 7;
  doc.text(`Fecha: ${formattedDate}`, leftMargin, y);
  y += 7;
  doc.text(`Cliente: ${ticket.clientName}`, leftMargin, y);
  y += 7;
  doc.text(`Celular: ${ticket.phoneNumber}`, leftMargin, y);
  y += 7;
  
  // Service type
  const services = ticket.services || [];
  const hasLaundry = services.some(s => s.name.includes('Valet'));
  const hasDryCleaning = services.some(s => !s.name.includes('Valet'));
  
  doc.text(`Tipo de servicio:`, leftMargin, y);
  y += 7;
  doc.text(`${hasLaundry ? '✓' : '□'} Lavandería    ${hasDryCleaning ? '✓' : '□'} Tintorería`, leftMargin + 5, y);
  y += 10;
  
  // Services
  doc.text('Servicios:', leftMargin, y);
  y += 7;
  
  if (services && services.length > 0) {
    services.forEach(service => {
      const quantity = 'quantity' in service && typeof service.quantity === 'number' ? service.quantity : 1;
      if (quantity > 1) {
        doc.text(`✓ ${service.name} x${quantity}`, leftMargin + 5, y);
      } else {
        doc.text(`✓ ${service.name}`, leftMargin + 5, y);
      }
      y += 6;
    });
  } else {
    // If no services are defined, add a placeholder
    doc.text('No se especificaron servicios', leftMargin + 5, y);
    y += 6;
  }
  
  // Options
  if (selectedOptions && selectedOptions.length > 0) {
    y += 4;
    doc.text('Opciones de lavado:', leftMargin, y);
    y += 7;
    
    selectedOptions.forEach(option => {
      doc.text(`✓ ${translateOption(option)}`, leftMargin + 5, y);
      y += 6;
    });
  }
  
  // Divider
  doc.line(10, y + 3, 200, y + 3);
  y += 10;
  
  // Calculate total items
  const totalItems = services.reduce((sum, service) => {
    const quantity = 'quantity' in service && typeof service.quantity === 'number' ? service.quantity : 1;
    return sum + quantity;
  }, 0);
  
  // Footer with totals
  doc.text(`Cantidad: ${totalItems}`, leftMargin, y);
  y += 7;
  doc.text(`Importe: $${ticket.totalPrice.toLocaleString()}`, leftMargin, y);
  y += 7;
  doc.text(`Método de pago: ${ticket.paymentMethod}`, leftMargin, y);
  y += 15;
  
  // Thank you message
  doc.setFontSize(9);
  doc.text('¡Gracias por su preferencia!', 105, y, { align: 'center' });
  
  // Return as base64 data URL
  return doc.output('datauristring');
};

/**
 * Opens WhatsApp with a PDF ticket
 * @param phoneNumber The phone number to send the message to
 * @param ticket The ticket data
 * @param selectedOptions Additional laundry options
 */
export const shareTicketPDFViaWhatsApp = (phoneNumber: string, ticket: Ticket, selectedOptions: LaundryOption[] = []): void => {
  if (!phoneNumber) {
    console.error('No phone number provided');
    return;
  }
  
  // Ensure ticket has a services array to prevent errors
  if (!ticket.services) {
    ticket.services = [];
  }
  
  // Format phone number (remove spaces, dashes, etc.)
  const formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
  
  // Create a message with a link to the PDF
  const pdfData = generateTicketPDF(ticket, selectedOptions);
  
  // Create an anchor element to trigger the download
  const message = `Hola! Tu pedido #${ticket.ticketNumber} ya está listo para retirar. Adjuntamos los detalles del ticket. Total: $${ticket.totalPrice.toLocaleString()}. Gracias por tu compra!`;
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message + '\n' + pdfData)}`;
  
  // Open WhatsApp in a new window
  window.open(whatsappUrl, '_blank');
};
