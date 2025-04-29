
import React from 'react';
import { Ticket } from '@/lib/types';

interface TicketDetailPanelProps {
  ticket?: Ticket;
  services?: any[];
  formatDate?: (date: string) => string;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({ 
  ticket,
  services = [],
  formatDate = (date) => date
}) => {
  if (!ticket) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Seleccione un ticket para ver los detalles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-b pb-2">Detalles del Ticket #{ticket.ticketNumber}</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Cliente:</span>
          <span>{ticket.clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Teléfono:</span>
          <span>{ticket.phoneNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Fecha de creación:</span>
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Estado:</span>
          <span>{ticket.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Pagado:</span>
          <span>{ticket.isPaid ? 'Sí' : 'No'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Método de pago:</span>
          <span>{ticket.paymentMethod}</span>
        </div>
      </div>

      {services && services.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Servicios:</h4>
          <div className="space-y-2">
            {services.map((service, index) => (
              <div key={index} className="flex justify-between border-b pb-1">
                <span>{service.name} {service.quantity > 1 ? `x${service.quantity}` : ''}</span>
                <span>${service.price || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 border-t pt-2">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${ticket.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPanel;
