
import React, { useRef } from 'react';
import { format } from 'date-fns';
import { Ticket, LaundryOption } from '@/lib/types';

interface TicketPrintProps {
  ticket: Ticket;
  selectedOptions: LaundryOption[];
  onClose: () => void;
}

// Función para traducir las opciones de lavandería al español
const translateOption = (option: LaundryOption): string => {
  switch (option) {
    case 'separateByColor': return 'Separar por color';
    case 'delicateDry': return 'Secado en frío';
    case 'stainRemoval': return 'Desmanchar';
    case 'bleach': return 'Blanquear';
    case 'noFragrance': return 'Sin perfume';
    case 'noDry': return 'No secar';
    default: return '';
  }
};

const TicketPrint: React.FC<TicketPrintProps> = ({ ticket, selectedOptions, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Ticket #${ticket.ticketNumber}</title>
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
            .ticket-number {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              margin-top: 10px;
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
            
            <div class="ticket-number">
              Ticket Canasto N°${ticket.ticketNumber}
            </div>
            
            <div class="footer">
              ¡Gracias por su preferencia!
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // Esperar a que el contenido se cargue antes de imprimir
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6" ref={printRef}>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Ohana</h2>
          <p className="text-sm text-gray-600">Lavandería - Tintorería</p>
          <p className="text-xs text-gray-600">Camargo 590 | CABA | 11 3642 4871</p>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="font-medium">Fecha:</span>
            <span>{format(new Date(ticket.createdAt), 'dd/MM/yyyy')}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Cliente:</span>
            <span>{ticket.clientName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Celular:</span>
            <span>{ticket.phoneNumber}</span>
          </div>
        </div>
        
        <div className="flex space-x-6 mb-4">
          <div className="flex items-center">
            <div className={`w-4 h-4 border border-gray-400 mr-2 flex items-center justify-center ${ticket.services.some(s => s.name.includes('Valet')) ? 'bg-blue-500 text-white' : 'bg-white'}`}>
              {ticket.services.some(s => s.name.includes('Valet')) && '✓'}
            </div>
            <span>Lavandería</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 border border-gray-400 mr-2 flex items-center justify-center ${ticket.services.some(s => !s.name.includes('Valet')) ? 'bg-blue-500 text-white' : 'bg-white'}`}>
              {ticket.services.some(s => !s.name.includes('Valet')) && '✓'}
            </div>
            <span>Tintorería</span>
          </div>
        </div>
        
        <div className="mb-4">
          {selectedOptions.map((option, index) => (
            <div key={index} className="flex items-center my-1">
              <div className="w-4 h-4 border border-gray-400 mr-2 bg-blue-500 text-white flex items-center justify-center">✓</div>
              <span>{translateOption(option)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-dashed border-gray-300 my-4"></div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="font-medium">Cantidad:</span>
            <span>{ticket.services.reduce((sum, service) => sum + 1, 0)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Importe:</span>
            <span>${ticket.totalPrice.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="text-center font-bold my-4">
          Ticket Canasto N°{ticket.ticketNumber}
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPrint;
