
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowUpCircle, CheckCircle } from 'lucide-react';
import { Ticket } from '@/lib/types';

interface PickupTicketListProps {
  tickets: Ticket[];
  selectedTicket: string | null;
  setSelectedTicket: (id: string | undefined) => void;
  formatDate: (dateString: string) => string;
}

const PickupTicketList: React.FC<PickupTicketListProps> = ({
  tickets,
  selectedTicket,
  setSelectedTicket,
  formatDate
}) => {
  console.log("PickupTicketList renderizando con", tickets.length, "tickets");
  console.log("Ticket statuses:", tickets.map(t => t.status).join(", "));

  // Depuración detallada de los tickets
  if (tickets.length > 0) {
    console.log("Primer ticket:", {
      id: tickets[0].id,
      ticketNumber: tickets[0].ticketNumber,
      clientName: tickets[0].clientName,
      phoneNumber: tickets[0].phoneNumber,
      status: tickets[0].status,
      totalPrice: tickets[0].totalPrice,
      isPaid: tickets[0].isPaid
    });
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        No hay tickets pendientes de entrega
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium bg-yellow-50 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>Listo para retirar</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-1 text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-full">
            <ArrowUpCircle className="h-3 w-3" />
            <span>En proceso</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1 text-gray-600 text-sm font-medium bg-gray-50 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>Pendiente</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-gray-600 text-sm font-medium bg-gray-50 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>{status}</span>
          </div>
        );
    }
  };

  return (
    <>
      {tickets.map(ticket => (
        <Card
          key={ticket.id}
          className={`
            cursor-pointer transition-all
            ${selectedTicket === ticket.id ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-blue-200'}
          `}
          onClick={() => setSelectedTicket(ticket.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium">{ticket.clientName || 'Cliente sin nombre'}</div>
                <div className="text-sm text-gray-500">{ticket.phoneNumber || 'Sin teléfono'}</div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Badge variant={ticket.isPaid ? "success" : "outline"} className="text-xs">
                  {ticket.isPaid ? "Pagado" : "Pendiente de pago"}
                </Badge>
                {getStatusBadge(ticket.status)}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <div>Fecha: {formatDate(ticket.createdAt)}</div>
              <div>Ticket #: {ticket.ticketNumber}</div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="font-medium text-blue-700">$ {(ticket.totalPrice || 0).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default PickupTicketList;
