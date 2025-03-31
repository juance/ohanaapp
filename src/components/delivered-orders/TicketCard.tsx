
import { Card, CardContent } from '@/components/ui/card';
import { Ticket } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StatusBadge } from './StatusBadge';

interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
}

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  } catch (e) {
    return dateString;
  }
};

export function TicketCard({ ticket, isSelected, onClick }: TicketCardProps) {
  return (
    <Card 
      className={`
        cursor-pointer transition-all
        ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-blue-200'}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-medium">{ticket.clientName}</div>
            <div className="text-sm text-gray-500">{ticket.phoneNumber}</div>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
        <div className="text-sm mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Fecha de creación:</span>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fecha de entrega:</span>
            <span>{formatDate(ticket.deliveredDate || '')}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="font-medium text-blue-700">$ {ticket.totalPrice.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
