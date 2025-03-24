
import React from 'react';
import { format } from 'date-fns';
import { Ticket, LaundryOption } from '@/lib/types';
import { translateOption } from '@/utils/translationUtils';

interface TicketPrintContentProps {
  ticket: Ticket;
  selectedOptions: LaundryOption[];
}

/**
 * Content component for the ticket print preview
 */
const TicketPrintContent: React.FC<TicketPrintContentProps> = ({ ticket, selectedOptions }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Ohana</h2>
        <p className="text-sm text-gray-600">Lavandería - Tintorería</p>
        <p className="text-xs text-gray-600">Camargo 590 | CABA | 11 3642 4871</p>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="font-medium">Ticket Número:</span>
          <span>{ticket.ticketNumber || 'N/A'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">N° Canasto:</span>
          <span>{ticket.basketTicketNumber || 'N/A'}</span>
        </div>
        
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
      
      {/* Display services with quantities */}
      <div className="mb-4">
        {ticket.services.map((service, index) => (
          <div key={index} className="flex justify-between items-center my-1">
            <div className="flex items-center">
              <div className="w-4 h-4 border border-gray-400 mr-2 bg-blue-500 text-white flex items-center justify-center">✓</div>
              <span>{service.name}</span>
            </div>
            {('quantity' in service && typeof service.quantity === 'number' && service.quantity > 1) && (
              <span className="text-sm font-medium">x{service.quantity}</span>
            )}
          </div>
        ))}
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
          <span>{ticket.services.reduce((sum, service) => sum + ('quantity' in service && typeof service.quantity === 'number' ? service.quantity : 1), 0)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Importe:</span>
          <span>${ticket.totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketPrintContent;
