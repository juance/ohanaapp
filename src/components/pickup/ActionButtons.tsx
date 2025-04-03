
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Printer, Share2, XCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Ticket } from '@/lib/types';

interface ActionButtonsProps {
  selectedTicket: string | null;
  ticket: Ticket | undefined;
  onNotifyClient: (ticket: Ticket) => void;
  onPrintTicket: () => void;
  onShareWhatsApp: () => void;
  onOpenCancelDialog: () => void;
  onMarkAsDelivered: (ticketId: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedTicket,
  ticket,
  onNotifyClient,
  onPrintTicket,
  onShareWhatsApp,
  onOpenCancelDialog,
  onMarkAsDelivered,
}) => {
  return (
    <div className="flex flex-wrap justify-end mb-4 gap-2">
      <Button 
        variant="outline" 
        className="flex items-center space-x-2"
        onClick={() => {
          if (ticket) onNotifyClient(ticket);
          else toast.error('Error', 'Seleccione un ticket primero');
        }}
        disabled={!selectedTicket}
      >
        <Bell className="h-4 w-4" />
        <span>Avisar al cliente</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center space-x-2"
        onClick={onPrintTicket}
        disabled={!selectedTicket}
      >
        <Printer className="h-4 w-4" />
        <span>IMPRIMIR</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center space-x-2"
        onClick={onShareWhatsApp}
        disabled={!selectedTicket}
      >
        <Share2 className="h-4 w-4" />
        <span>ENVIAR POR WHATSAPP</span>
      </Button>
      
      <Button 
        variant="destructive" 
        className="flex items-center space-x-2"
        onClick={onOpenCancelDialog}
        disabled={!selectedTicket}
      >
        <XCircle className="h-4 w-4" />
        <span>ANULAR</span>
      </Button>
      
      <Button 
        variant="default" 
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
        onClick={() => {
          if (selectedTicket) onMarkAsDelivered(selectedTicket);
          else toast.error('Error', 'Seleccione un ticket primero');
        }}
        disabled={!selectedTicket}
      >
        <CheckCircle className="h-4 w-4" />
        <span>ENTREGADO</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
