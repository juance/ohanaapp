
import { Ticket } from '@/lib/types';
import { formatDate } from './TicketCard';

interface TicketDetailProps {
  ticket: Ticket | null;
  services: any[];
}

export function TicketDetail({ ticket, services }: TicketDetailProps) {
  if (!ticket) {
    return (
      <p className="text-center text-gray-500">Seleccione un ticket para ver los detalles</p>
    );
  }
  
  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-medium">Detalles del Ticket</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Cliente:</p>
            <p className="font-medium">{ticket.clientName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Teléfono:</p>
            <p className="font-medium">{ticket.phoneNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Fecha de creación:</p>
            <p className="font-medium">{formatDate(ticket.createdAt)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Fecha de entrega:</p>
            <p className="font-medium">{formatDate(ticket.deliveredDate || '')}</p>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <p className="font-medium mb-2">Servicios:</p>
          <div className="space-y-2">
            {services.length > 0 ? (
              services.map((service, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-1">
                  <span>
                    {service.name} x{service.quantity}
                  </span>
                  <span>$ {(service.price * service.quantity).toLocaleString()}</span>
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
}
