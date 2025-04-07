
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Printer, Share2, XCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';

interface PickupActionButtonsProps {
  tickets: Ticket[];
  selectedTicket: string | null;
  handleMarkAsDelivered: (ticketId: string) => Promise<void>;
  handleOpenCancelDialog: () => void;
  handlePrintTicket: () => void;
  handleShareWhatsApp: () => void;
}

const PickupActionButtons: React.FC<PickupActionButtonsProps> = ({
  tickets,
  selectedTicket,
  handleMarkAsDelivered,
  handleOpenCancelDialog,
  handlePrintTicket,
  handleShareWhatsApp
}) => {
  const handleNotifyClient = () => {
    if (!selectedTicket) {
      toast.error('Seleccione un ticket primero');
      return;
    }

    const ticket = tickets.find(t => t.id === selectedTicket);
    if (!ticket) {
      toast.error('Ticket no encontrado');
      return;
    }

    const whatsappMessage = encodeURIComponent(
      `Hola ${ticket.clientName}, su pedido está listo para retirar en Lavandería Ohana.`
    );
    const whatsappUrl = `https://wa.me/${ticket.phoneNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

    window.open(whatsappUrl, '_blank');

    toast.success(`Notificación enviada a ${ticket.clientName}`, {
      description: `Se notificó que su pedido está listo para retirar.`
    });
  };

  return (
    <div className="flex flex-wrap justify-end mb-4 gap-2">
      <Button
        variant="outline"
        className="flex items-center space-x-2"
        onClick={handleNotifyClient}
        disabled={!selectedTicket}
      >
        <Bell className="h-4 w-4" />
        <span>Avisar al cliente</span>
      </Button>

      <Button
        variant="outline"
        className="flex items-center space-x-2"
        onClick={handlePrintTicket}
        disabled={!selectedTicket}
      >
        <Printer className="h-4 w-4" />
        <span>IMPRIMIR</span>
      </Button>

      <Button
        variant="outline"
        className="flex items-center space-x-2"
        onClick={handleShareWhatsApp}
        disabled={!selectedTicket}
      >
        <Share2 className="h-4 w-4" />
        <span>ENVIAR POR WHATSAPP</span>
      </Button>

      <Button
        variant="destructive"
        className="flex items-center space-x-2"
        onClick={handleOpenCancelDialog}
        disabled={!selectedTicket}
      >
        <XCircle className="h-4 w-4" />
        <span>ANULAR</span>
      </Button>

      <Button
        variant="default"
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
        onClick={() => selectedTicket ? handleMarkAsDelivered(selectedTicket) : toast.error('Seleccione un ticket primero')}
        disabled={!selectedTicket}
      >
        <CheckCircle className="h-4 w-4" />
        <span>ENTREGADO</span>
      </Button>
    </div>
  );
};

export default PickupActionButtons;
