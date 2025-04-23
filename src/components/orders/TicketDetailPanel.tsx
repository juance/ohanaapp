
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/lib/types';

export interface TicketDetailPanelProps {
  selectedTicket: string | null;
  tickets: Ticket[];
  ticketServices: any[];
  formatDate: (date: string) => string;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({
  selectedTicket,
  tickets,
  ticketServices,
  formatDate
}) => {
  const ticket = tickets.find(t => t.id === selectedTicket);

  if (!selectedTicket || !ticket) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <p className="mb-2 text-lg font-medium">Detalle del Ticket</p>
        <p className="text-gray-500">Seleccione un ticket para ver sus detalles</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Detalle del Ticket #{ticket.ticketNumber}</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{ticket.clientName || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">{ticket.phoneNumber || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha de Creación</p>
            <p className="font-medium">{formatDate(ticket.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha de Entrega</p>
            <p className="font-medium">
              {ticket.deliveredDate ? formatDate(ticket.deliveredDate) : 'No entregado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <Badge
              variant={ticket.status === 'delivered' ? 'default' : 'secondary'}
            >
              {ticket.status === 'delivered' ? 'Entregado' : 'Pendiente'}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-medium">${ticket.totalPrice?.toFixed(2)}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Items</h4>
          {ticketServices.length > 0 ? (
            <ul className="space-y-2">
              {ticketServices.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name} x{item.quantity || 1}</span>
                  <span>${item.price?.toFixed(2) || '0.00'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay items para mostrar</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPanel;
