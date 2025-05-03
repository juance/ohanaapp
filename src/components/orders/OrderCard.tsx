
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Printer, Send, Check } from 'lucide-react';

interface OrderCardProps {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber?: string;
  status: string;
  createdDate: string;
  totalPrice: number;
  isPaid: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMarkAsDelivered?: (id: string) => void;
  onPrint?: (id: string) => void;
  onNotify?: (id: string, phoneNumber?: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  id,
  ticketNumber,
  clientName,
  phoneNumber,
  status,
  createdDate,
  totalPrice,
  isPaid,
  isSelected,
  onSelect,
  onMarkAsDelivered,
  onPrint,
  onNotify
}) => {
  // Format the date for display
  const formattedDate = new Date(createdDate).toLocaleDateString('es-ES');
  
  // Determine badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Translate status to Spanish
  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
        return 'Listo';
      case 'processing':
        return 'En proceso';
      case 'pending':
        return 'Pendiente';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <Card 
      className={`mb-2 cursor-pointer transition-colors ${isSelected ? 'border-primary' : ''}`}
      onClick={() => onSelect(id)}
    >
      <CardHeader className="py-3 px-4 flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="font-semibold">{clientName}</div>
          <div className="text-sm text-muted-foreground">#{ticketNumber}</div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant={getBadgeVariant(status) as any}>
            {translateStatus(status)}
          </Badge>
          <span className="text-xs text-muted-foreground mt-1">{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4 pt-0 flex justify-between items-center">
        <div>
          <span className="font-medium text-lg">${totalPrice.toFixed(2)}</span>
          {isPaid ? (
            <Badge variant="outline" className="ml-2 text-xs">Pagado</Badge>
          ) : (
            <Badge variant="outline" className="ml-2 text-xs bg-amber-50 text-amber-700 border-amber-200">Pago pendiente</Badge>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={(e) => {
            e.stopPropagation();
            if (onPrint) onPrint(id);
          }}>
            <Printer className="h-4 w-4" />
          </Button>
          
          <Button size="icon" variant="ghost" onClick={(e) => {
            e.stopPropagation();
            if (onNotify) onNotify(id, phoneNumber);
          }}>
            <Send className="h-4 w-4" />
          </Button>
          
          {onMarkAsDelivered && status.toLowerCase() === 'ready' && (
            <Button size="icon" variant="ghost" onClick={(e) => {
              e.stopPropagation();
              if (onMarkAsDelivered) onMarkAsDelivered(id);
            }}>
              <Check className="h-4 w-4" />
            </Button>
          )}
          
          <Button size="icon" variant="outline" onClick={() => onSelect(id)}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
