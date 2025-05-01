
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Printer, Share2, X, Bell, CreditCard } from 'lucide-react';
import { Ticket } from '@/lib/types';

interface PickupActionButtonsProps {
  tickets: Ticket[];
  selectedTicket: string | null;
  handleMarkAsDelivered: (ticketId: string) => Promise<void>;
  handleOpenCancelDialog: () => void;
  handlePrintTicket: (ticketId: string) => void;
  handleShareWhatsApp: (ticketId: string, phoneNumber?: string) => void;
  handleNotifyClient: (ticketId: string, phoneNumber?: string) => void;
  handleOpenPaymentMethodDialog: () => void;
}

const PickupActionButtons: React.FC<PickupActionButtonsProps> = ({
  tickets,
  selectedTicket,
  handleMarkAsDelivered,
  handleOpenCancelDialog,
  handlePrintTicket,
  handleShareWhatsApp,
  handleNotifyClient,
  handleOpenPaymentMethodDialog
}) => {
  const getSelectedTicketPhone = () => {
    if (!selectedTicket) return '';
    const ticket = tickets.find(t => t.id === selectedTicket);
    return ticket ? ticket.phoneNumber : '';
  };

  const isTicketSelected = !!selectedTicket;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant="default"
        size="sm"
        className="flex items-center"
        disabled={!isTicketSelected}
        onClick={() => selectedTicket && handleMarkAsDelivered(selectedTicket)}
      >
        <Check className="mr-1 h-4 w-4" />
        <span>Entregar</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center"
        disabled={!isTicketSelected}
        onClick={() => selectedTicket && handlePrintTicket(selectedTicket)}
      >
        <Printer className="mr-1 h-4 w-4" />
        <span>Imprimir</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center"
        disabled={!isTicketSelected}
        onClick={() => selectedTicket && handleShareWhatsApp(selectedTicket, getSelectedTicketPhone())}
      >
        <Share2 className="mr-1 h-4 w-4" />
        <span>WhatsApp</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center"
        disabled={!isTicketSelected}
        onClick={() => selectedTicket && handleNotifyClient(selectedTicket, getSelectedTicketPhone())}
      >
        <Bell className="mr-1 h-4 w-4" />
        <span>Notificar</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center"
        disabled={!isTicketSelected}
        onClick={handleOpenPaymentMethodDialog}
      >
        <CreditCard className="mr-1 h-4 w-4" />
        <span>Método de pago</span>
      </Button>

      <Button
        variant="destructive"
        size="sm"
        className="flex items-center"
        disabled={!isTicketSelected}
        onClick={handleOpenCancelDialog}
      >
        <X className="mr-1 h-4 w-4" />
        <span>Cancelar</span>
      </Button>
    </div>
  );
};

export default PickupActionButtons;
