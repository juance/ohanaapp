
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTicket: any | null;
  messageType: '45days' | '90days';
  customMessage: string;
  onMessageChange: (message: string) => void;
  onSendWhatsApp: () => void;
}

export function MessageDialog({
  open,
  onOpenChange,
  selectedTicket,
  messageType,
  customMessage,
  onMessageChange,
  onSendWhatsApp
}: MessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar mensaje de WhatsApp</DialogTitle>
          <DialogDescription>
            {messageType === '45days' 
              ? 'Recordatorio a los 45 días de no retirar el pedido'
              : 'Aviso de donación después de 90 días'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Cliente: {selectedTicket?.clientName}</p>
            <p className="text-sm text-gray-500">Teléfono: {selectedTicket?.phoneNumber}</p>
          </div>
          
          <Textarea
            placeholder="Escriba su mensaje aquí..."
            value={customMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSendWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar por WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
