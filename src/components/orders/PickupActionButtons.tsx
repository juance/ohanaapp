
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Printer, Share2, X, Bell } from 'lucide-react';

interface PickupActionButtonsProps {
  tickets: any[];
  selectedTicket: string | null;
  handleMarkAsDelivered: (ticketId: string) => void;
  handleOpenCancelDialog: () => void;
  handlePrintTicket: (ticketId: string) => void;
  handleShareWhatsApp: (ticketId: string, phoneNumber?: string) => void;
  handleNotifyClient?: (ticketId: string, phoneNumber?: string) => void;
}

const PickupActionButtons: React.FC<PickupActionButtonsProps> = ({
  tickets,
  selectedTicket,
  handleMarkAsDelivered,
  handleOpenCancelDialog,
  handlePrintTicket,
  handleShareWhatsApp,
  handleNotifyClient
}) => {
  const isButtonDisabled = !selectedTicket;

  const selectedTicketObject = tickets.find((ticket) => ticket.id === selectedTicket);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="default"
        size="sm"
        className="gap-1"
        disabled={isButtonDisabled}
        onClick={() => selectedTicket && handleMarkAsDelivered(selectedTicket)}
      >
        <Check className="h-4 w-4" />
        Marcar como Entregado
      </Button>

      <Button
        variant="destructive"
        size="sm"
        className="gap-1"
        disabled={isButtonDisabled}
        onClick={handleOpenCancelDialog}
      >
        <X className="h-4 w-4" />
        Cancelar Ticket
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={isButtonDisabled}
        onClick={() => selectedTicket && handlePrintTicket(selectedTicket)}
      >
        <Printer className="h-4 w-4" />
        Imprimir
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={isButtonDisabled || !selectedTicketObject?.phoneNumber}
        onClick={() => selectedTicket && selectedTicketObject &&
          handleShareWhatsApp(selectedTicket, selectedTicketObject.phoneNumber)
        }
      >
        <Share2 className="h-4 w-4" />
        Compartir por WhatsApp
      </Button>

      {handleNotifyClient && (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={isButtonDisabled || !selectedTicketObject?.phoneNumber}
          onClick={() => selectedTicket && selectedTicketObject &&
            handleNotifyClient(selectedTicket, selectedTicketObject.phoneNumber)
          }
        >
          <Bell className="h-4 w-4" />
          Avisar al Cliente
        </Button>
      )}
    </div>
  );
};

export default PickupActionButtons;
