
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Ticket } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicket: string | null;
  onSelectTicket: (ticketId: string) => void;
  searchQuery: string;
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  } catch (e) {
    return dateString;
  }
};

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  searchQuery,
}) => {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50 max-h-[calc(100vh-300px)] overflow-y-auto">
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <Card
            key={ticket.id}
            className={`
              cursor-pointer transition-all
              ${selectedTicket === ticket.id ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-blue-200'}
            `}
            onClick={() => onSelectTicket(ticket.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium">{ticket.clientName}</div>
                  <div className="text-sm text-gray-500">{ticket.phoneNumber}</div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <Badge variant={ticket.isPaid ? "success" : "outline"} className="text-xs">
                    {ticket.isPaid ? "Pagado" : "Pendiente de pago"}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium bg-yellow-50 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    <span>Por retirar</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Fecha: {formatDate(ticket.createdAt)}</div>
              <div className="mt-2 flex justify-between items-center">
                <span className="font-medium text-blue-700">$ {ticket.totalPrice.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center p-6 text-gray-500">
          {searchQuery ? 
            'No se encontraron tickets que coincidan con su búsqueda' : 
            'No hay tickets pendientes de entrega'}
        </div>
      )}
    </div>
  );
};

export default TicketList;
