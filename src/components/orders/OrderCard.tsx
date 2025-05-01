
import React from 'react';
import { Ticket } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeClass } from '@/lib/ticket/ticketStatusService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderCardProps {
  ticket: Ticket;
  onStatusChange: () => void;
  onCancel: () => void;
  onPaymentMethodChange: () => void;
  actionIcon?: React.ReactNode;
  actionLabel: string;
  secondaryAction?: () => void;
  secondaryIcon?: React.ReactNode;
  secondaryLabel?: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  ticket,
  onStatusChange,
  onCancel,
  onPaymentMethodChange,
  actionIcon,
  actionLabel,
  secondaryAction,
  secondaryIcon,
  secondaryLabel
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  const badgeClass = getStatusBadgeClass(ticket.status);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">
              #{ticket.ticketNumber} - {ticket.clientName}
            </CardTitle>
            <p className="text-sm text-gray-500">{ticket.phoneNumber}</p>
          </div>
          <Badge className={badgeClass}>{ticket.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-500">Fecha:</div>
          <div className="text-right">{formatDate(ticket.createdAt)}</div>
          <div className="text-gray-500">Total:</div>
          <div className="text-right font-medium">${ticket.totalPrice}</div>
          <div className="text-gray-500">Pago:</div>
          <div className="text-right">{ticket.paymentMethod}</div>
          <div className="text-gray-500">Estado Pago:</div>
          <div className="text-right">{ticket.isPaid ? 'Pagado' : 'Pendiente'}</div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-2 flex-wrap gap-2">
        <Button 
          size="sm" 
          onClick={onStatusChange}
          className="flex items-center"
        >
          {actionIcon}
          {actionLabel}
        </Button>
        
        {secondaryAction && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={secondaryAction}
            className="flex items-center"
          >
            {secondaryIcon}
            {secondaryLabel}
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPaymentMethodChange}
          className="ml-auto"
        >
          Método de pago
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onCancel}
          className="text-red-500 hover:text-red-700"
        >
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
