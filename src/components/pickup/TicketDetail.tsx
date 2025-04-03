
import React from 'react';
import { Ticket } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket | undefined;
  ticketServices: any[];
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  } catch (e) {
    return 'Fecha inválida';
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
            <p className="font-medium">{ticket.clientName || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Teléfono:</p>
            <p className="font-medium">{ticket.phoneNumber || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Fecha:</p>
            <p className="font-medium">{ticket.createdAt ? formatDate(ticket.createdAt) : 'N/A'}</p>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <p className="font-medium mb-2">Servicios:</p>
          <div className="space-y-2">
            {ticketServices && ticketServices.length > 0 ? (
              ticketServices.map((service, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-1">
                  <span>
                    {service.name} x{service.quantity || 1}
                  </span>
                  <span>$ {(service.price || 0).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center text-amber-600 text-sm bg-amber-50 p-2 rounded">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>No hay servicios registrados para este ticket</span>
              </div>
            )}
          </div>
          <div className="flex justify-between font-medium mt-3 text-blue-700">
            <span>Total:</span>
            <span>$ {(ticket.totalPrice || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
