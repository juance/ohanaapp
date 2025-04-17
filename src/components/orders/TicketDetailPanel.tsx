import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, CheckCircle } from 'lucide-react';
import PaymentMethodDialog from './PaymentMethodDialog';
import { Ticket } from '@/lib/types';

interface TicketDetailPanelProps {
  ticket: Ticket;
  onUpdatePaymentMethod: (ticketId: string, paymentMethod: string) => void;
  onMarkAsDelivered: (ticketId: string) => void;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({ ticket, onUpdatePaymentMethod, onMarkAsDelivered }) => {
  const [open, setOpen] = React.useState(false);

  const handlePaymentMethodUpdate = (paymentMethod: string) => {
    onUpdatePaymentMethod(ticket.id, paymentMethod);
  };

  const handleMarkDelivered = () => {
    onMarkAsDelivered(ticket.id);
  };

  const formattedDeliveryDate = ticket.deliveredDate
    ? format(new Date(ticket.deliveredDate), 'dd/MM/yyyy HH:mm')
    : 'No entregado';

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Detalle del Ticket</h2>
          <p className="text-sm text-gray-500">#{ticket.ticketNumber}</p>
        </div>
        {ticket.status === 'delivered' && (
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-5 w-5 mr-2" />
            Entregado
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Cliente:</span>
          <span>{ticket.clientName || 'N/A'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Teléfono:</span>
          <span>{ticket.phoneNumber || 'N/A'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total:</span>
          <span>${ticket.totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Método de pago:</span>
          <span>{ticket.paymentMethod || 'N/A'}</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Cambiar
              </Button>
            </DialogTrigger>
            <PaymentMethodDialog
              open={open}
              onOpenChange={setOpen}
              currentPaymentMethod={ticket.paymentMethod as any}
              onConfirm={handlePaymentMethodUpdate}
              ticketNumber={ticket.ticketNumber}
            />
          </Dialog>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Fecha de creación:</span>
          <span>{format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Fecha de entrega:</span>
          <span>{ticket.deliveredDate ? format(new Date(ticket.deliveredDate), 'dd/MM/yyyy HH:mm') : 'No entregado'}</span>
        </div>
      </div>

      {ticket.status !== 'delivered' && (
        <Button onClick={handleMarkDelivered} className="w-full">
          Marcar como Entregado
        </Button>
      )}
    </div>
  );
};

export default TicketDetailPanel;
