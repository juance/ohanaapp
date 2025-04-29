
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/lib/types';

interface TicketCardProps {
  ticket: Ticket;
  onAction: () => void;
  actionLabel: string;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onAction, actionLabel }) => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-medium">{ticket.clientName || ticket.customerName || 'Cliente sin nombre'}</div>
            <div className="text-sm text-gray-500">{ticket.phoneNumber || ticket.customerPhone || 'Sin teléfono'}</div>
          </div>
          <Badge variant={ticket.isPaid ? "success" : "outline"} className="text-xs">
            {ticket.isPaid ? "Pagado" : "Pendiente de pago"}
          </Badge>
        </div>
        
        <div className="text-sm text-gray-500">
          <div>Fecha: {formatDate(ticket.createdAt)}</div>
          <div>Ticket #: {ticket.ticketNumber}</div>
          <div>Estado: {ticket.status}</div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="font-medium text-blue-700">$ {(ticket.totalPrice || 0).toLocaleString()}</span>
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
