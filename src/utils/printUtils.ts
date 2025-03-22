
import { Ticket, LaundryOption } from '@/lib/types';
import { format } from 'date-fns';
import { translateOption } from './translationUtils';

/**
 * Generate the HTML content for printing a ticket
 */
export const generateTicketPrintHTML = (ticket: Ticket, selectedOptions: LaundryOption[]): string => {
  return `
    <html>
      <head>
        <title>Ticket</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 80mm; /* Ancho estándar para tickets */
          }
          .ticket {
            padding: 10px;
          }
          .header {
            text-align: center;
            margin-bottom: 10px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
          }
          .address {
            font-size: 12px;
            margin-bottom: 5px;
          }
          .info-row {
            display: flex;
            padding: 4px 0;
            border-bottom: 1px dotted #ccc;
          }
          .info-label {
            font-weight: bold;
            width: 100px;
          }
          .service-option {
            margin: 5px 0;
          }
          .checkbox {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 1px solid #000;
            margin-right: 5px;
            position: relative;
          }
          .checkbox.checked:after {
            content: "✓";
            position: absolute;
            top: -4px;
            left: 2px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
          }
          .divider {
            border-top: 1px dotted #000;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="logo">Ohana</div>
            <div class="address">Lavandería - Tintorería</div>
            <div class="address">Camargo 590 | CABA | 11 3642 4871</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">N° Canasto:</div>
            <div>${ticket.basketTicketNumber || 'N/A'}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Fecha:</div>
            <div>${format(new Date(ticket.createdAt), 'dd/MM/yyyy')}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Cliente:</div>
            <div>${ticket.clientName}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Celular:</div>
            <div>${ticket.phoneNumber}</div>
          </div>
          
          <div style="margin-top: 10px;">
            <div style="display: inline-block; margin-right: 20px;">
              <span class="checkbox ${ticket.services.some(s => s.name.includes('Valet')) ? 'checked' : ''}"></span>
              Lavandería
            </div>
            <div style="display: inline-block;">
              <span class="checkbox ${ticket.services.some(s => !s.name.includes('Valet')) ? 'checked' : ''}"></span>
              Tintorería
            </div>
          </div>
          
          <div style="margin-top: 10px;">
            ${selectedOptions.map(option => `
              <div class="service-option">
                <span class="checkbox checked"></span>
                ${translateOption(option)}
              </div>
            `).join('')}
          </div>
          
          <div class="divider"></div>
          
          <div class="info-row">
            <div class="info-label">Cantidad:</div>
            <div>${ticket.services.reduce((sum, service) => sum + 1, 0)}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Importe:</div>
            <div>$${ticket.totalPrice.toLocaleString()}</div>
          </div>
          
          <div class="footer">
            ¡Gracias por su preferencia!
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Handle the printing of a ticket
 */
export const handleTicketPrint = (ticket: Ticket, selectedOptions: LaundryOption[]): void => {
  const html = generateTicketPrintHTML(ticket, selectedOptions);
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for content to load before printing
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
};
