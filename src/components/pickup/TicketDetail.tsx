
import React from 'react';
import { Ticket } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TicketDetailProps {
  ticket: Ticket | undefined;
  ticketServices: any[];
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  } catch (e) {
    return dateString;
  }
};

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, ticketServices }) => {
  if (!ticket) {
    return <p className="text-center text-gray-500">Seleccione un ticket para ver los detalles</p>;
  }

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-medium">Detalles del Ticket</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Ticket N°:</p>
            <p className="font-medium">{ticket.ticketNumber || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Cliente:</p>
            <p className="font-medium">{ticket.clientName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Teléfono:</p>
            <p className="font-medium">{ticket.phoneNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Fecha:</p>
            <p className="font-medium">{formatDate(ticket.createdAt)}</p>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <p className="font-medium mb-2">Servicios:</p>
          <div className="space-y-2">
            {ticketServices.length > 0 ? (
              ticketServices.map((service, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-1">
                  <span>
                    {service.name} x{service.quantity}
                  </span>
                  <span>$ {(service.price).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Cargando servicios...</p>
            )}
          </div>
          <div className="flex justify-between font-medium mt-3 text-blue-700">
            <span>Total:</span>
            <span>$ {ticket.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
