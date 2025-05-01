
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';
import { cancelTicket } from '@/lib/ticket/ticketStatusTransitionService';

interface CancelTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketNumber: string;
  onCanceled: () => void;
}

const CancelTicketDialog: React.FC<CancelTicketDialogProps> = ({
  isOpen,
  onClose,
  ticketId,
  ticketNumber,
  onCanceled
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Por favor ingrese un motivo para la cancelación');
      return;
    }

    setIsSubmitting(true);
    try {
      await cancelTicket(ticketId, cancelReason);
      toast.success('Ticket cancelado con éxito');
      onCanceled();
      onClose();
    } catch (error) {
      console.error('Error al cancelar ticket:', error);
      toast.error('Error al cancelar el ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Ticket #{ticketNumber}</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es irreversible. El ticket será marcado como cancelado.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="cancelReason">Motivo de la cancelación</Label>
          <Textarea
            id="cancelReason"
            placeholder="Ingrese el motivo de la cancelación"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelTicketDialog;
