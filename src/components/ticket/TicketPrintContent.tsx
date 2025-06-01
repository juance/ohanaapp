
import React from 'react';
import { Ticket, LaundryOption } from '@/lib/types';

// Define the props interface for this component
export interface TicketPrintContentProps {
  ticket: Ticket;
  selectedOptions: LaundryOption[];
}

const TicketPrintContent: React.FC<TicketPrintContentProps> = ({ ticket, selectedOptions }) => {
  return (
    <div className="bg-white p-6 mb-4 rounded-t-lg">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Lavandería Ticket</h2>
        <p>Ticket #: {ticket.ticketNumber}</p>
        <p>Fecha: {new Date(ticket.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div className="mb-4">
        <p><strong>Cliente:</strong> {ticket.clientName}</p>
        <p><strong>Teléfono:</strong> {ticket.phoneNumber}</p>
      </div>
      
      {ticket.services && ticket.services.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold">Servicios:</h3>
          <ul>
            {ticket.services.map((service) => (
              <li key={service.id} className="flex justify-between">
                <span>{service.name || 'Servicio'} x {service.quantity || 1}</span>
                <span>${service.price ? service.price.toLocaleString() : '0'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {selectedOptions && selectedOptions.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold">Opciones de Lavado:</h3>
          <ul>
            {selectedOptions.map((option) => (
              <li key={option.id}>{option.name}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="border-t pt-2 mt-2">
        <p className="font-bold text-right">Total: ${ticket.totalPrice.toLocaleString()}</p>
        <p className="text-right text-sm">Método de pago: {ticket.paymentMethod}</p>
        <p className="text-center mt-4 text-sm">¡Gracias por su preferencia!</p>
      </div>
    </div>
  );
};

export default TicketPrintContent;
