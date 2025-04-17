
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/lib/types';

interface DeliveredTicketListProps {
  tickets: Ticket[];
  selectedTicket: string | null;
  setSelectedTicket: (id: string) => void;
  formatDate: (dateString: string) => string;
}

const DeliveredTicketList: React.FC<DeliveredTicketListProps> = ({
  tickets,
  selectedTicket,
  setSelectedTicket,
  formatDate
}) => {
  // Sort tickets by delivered date in descending order
  const sortedTickets = [...tickets].sort((a, b) => {
    const dateA = a.deliveredDate ? new Date(a.deliveredDate).getTime() : 0;
    const dateB = b.deliveredDate ? new Date(b.deliveredDate).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="space-y-3">
      {tickets.length === 0 ? (
        <div className="text-center p-6 text-gray-500">
          No hay tickets entregados
        </div>
      ) : (
        sortedTickets.map(ticket => (
          <Card
            key={ticket.id}
            className={`cursor-pointer transition-all ${
              selectedTicket === ticket.id ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-blue-200'
            }`}
            onClick={() => setSelectedTicket(ticket.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{ticket.clientName || 'Cliente sin nombre'}</div>
                  <div className="text-sm text-gray-500">{ticket.phoneNumber || 'Sin teléfono'}</div>
                </div>
                <Badge variant={ticket.isPaid ? "success" : "outline"} className="text-xs">
                  {ticket.isPaid ? "Pagado" : "No pagado"}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                <div>Fecha: {formatDate(ticket.createdAt)}</div>
                <div>Entregado: {formatDate(ticket.deliveredDate || '')}</div>
                <div>Ticket #: {ticket.ticketNumber}</div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="font-medium text-blue-700">$ {ticket.totalPrice.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default DeliveredTicketList;
