
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/lib/types';

interface TicketDetailPanelProps {
  selectedTicket: string | null;
  tickets: Ticket[];
  ticketServices: any[];
  formatDate: (dateString: string) => string;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({
  selectedTicket,
  tickets,
  ticketServices,
  formatDate
}) => {
  if (!selectedTicket) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Seleccione un ticket para ver los detalles</p>
      </div>
    );
  }

  const ticket = tickets.find(t => t.id === selectedTicket);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Ticket no encontrado</p>
      </div>
    );
  }

  // Verificar si el ticket tiene servicios directamente
  const hasTicketServices = ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0;

  // Usar los servicios del ticket si están disponibles, de lo contrario usar los servicios cargados
  const displayServices = hasTicketServices
    ? ticket.dryCleaningItems.map((item: any) => ({
        id: item.id || `temp-${Math.random()}`,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price || 0,
        ticketId: ticket.id
      }))
    : ticketServices;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Detalles del Ticket</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Número de Ticket</p>
            <p className="font-medium">{ticket.ticketNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="font-medium">{formatDate(ticket.createdAt)}</p>
          </div>
          {(ticket.deliveredAt || ticket.deliveredDate) && (
            <div>
              <p className="text-sm text-gray-500">Fecha de Entrega</p>
              <p className="font-medium">{formatDate(ticket.deliveredAt || ticket.deliveredDate || '')}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Estado de Pago</p>
            <Badge variant={ticket.isPaid ? "success" : "outline"}>
              {ticket.isPaid ? "Pagado" : "Pendiente de pago"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Cliente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-medium">{ticket.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">{ticket.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Servicios</h3>
        {displayServices.length > 0 ? (
          <div className="space-y-2">
            {displayServices.map(service => (
              <div key={service.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span className="font-medium">{service.name}</span>
                  {service.quantity > 1 && <span className="ml-1 text-sm text-gray-500">x{service.quantity}</span>}
                </div>
                <span className="font-medium">${service.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <span className="font-bold">Total</span>
              <span className="font-bold text-blue-700">${ticket.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 border rounded-md bg-gray-50">
            <p className="text-gray-500 mb-2">No hay servicios registrados para este ticket</p>
            <p className="text-sm text-gray-400">Los servicios se cargarán automáticamente cuando estén disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailPanel;
