
import { Ticket, LaundryOption } from '@/lib/types';
import { translateOption } from './translationUtils';

/**
 * Convert ticket to HTML for printing
 */
const ticketToHtml = (ticket: Ticket, selectedOptions: LaundryOption[] = []): string => {
  // Format date string
  const date = new Date(ticket.createdAt);
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  
  // Calculate total items
  const totalItems = ticket.services.reduce((sum, service) => {
    const quantity = 'quantity' in service && typeof service.quantity === 'number' ? service.quantity : 1;
    return sum + quantity;
  }, 0);
  
  return `
    <div style="font-family: Arial, sans-serif; width: 350px; padding: 20px; background-color: white;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 24px;">Ohana</h2>
        <p style="margin: 5px 0; font-size: 14px; color: #666;">Lavandería - Tintorería</p>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">Camargo 590 | CABA | 11 3642 4871</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Ticket Número:</span>
          <span>${ticket.ticketNumber || 'N/A'}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">N° Canasto:</span>
          <span>${ticket.basketTicketNumber || 'N/A'}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Fecha:</span>
          <span>${formattedDate}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Cliente:</span>
          <span>${ticket.clientName}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Celular:</span>
          <span>${ticket.phoneNumber}</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 24px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center;">
          <div style="width: 16px; height: 16px; border: 1px solid #999; margin-right: 8px; display: flex; align-items: center; justify-content: center; background-color: ${ticket.services.some(s => s.name.includes('Valet')) ? '#3b82f6' : 'white'}; color: white;">
            ${ticket.services.some(s => s.name.includes('Valet')) ? '✓' : ''}
          </div>
          <span>Lavandería</span>
        </div>
        
        <div style="display: flex; align-items: center;">
          <div style="width: 16px; height: 16px; border: 1px solid #999; margin-right: 8px; display: flex; align-items: center; justify-content: center; background-color: ${ticket.services.some(s => !s.name.includes('Valet')) ? '#3b82f6' : 'white'}; color: white;">
            ${ticket.services.some(s => !s.name.includes('Valet')) ? '✓' : ''}
          </div>
          <span>Tintorería</span>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        ${ticket.services.map(service => `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="width: 16px; height: 16px; border: 1px solid #999; margin-right: 8px; display: flex; align-items: center; justify-content: center; background-color: #3b82f6; color: white;">✓</div>
              <span>${service.name}</span>
            </div>
            ${('quantity' in service && typeof service.quantity === 'number' && service.quantity > 1) 
              ? `<span style="font-size: 14px; font-weight: 500;">x${service.quantity}</span>` 
              : ''}
          </div>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 20px;">
        ${selectedOptions.map(option => `
          <div style="display: flex; align-items: center; margin-bottom: 6px;">
            <div style="width: 16px; height: 16px; border: 1px solid #999; margin-right: 8px; display: flex; align-items: center; justify-content: center; background-color: #3b82f6; color: white;">✓</div>
            <span>${translateOption(option)}</span>
          </div>
        `).join('')}
      </div>
      
      <div style="border-top: 1px dashed #999; margin: 20px 0;"></div>
      
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Cantidad:</span>
          <span>${totalItems}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Importe:</span>
          <span>$${ticket.totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;
};

/**
 * Print ticket
 */
export const handleTicketPrint = (ticket: Ticket, selectedOptions: LaundryOption[] = []) => {
  // Generate HTML
  const html = ticketToHtml(ticket, selectedOptions);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please enable popups to print tickets');
    return;
  }
  
  // Write the HTML to the new window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ticket #${ticket.ticketNumber}</title>
        <style>
          body {
            margin: 0;
            padding: 10px;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
          }
          
          @media print {
            body {
              width: 80mm;
              margin: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        ${html}
        <script>
          // Auto-print when the content has loaded
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  
  // Close the document
  printWindow.document.close();
};
