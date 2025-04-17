
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CancelTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  handleCancelTicket: () => void;
}

const CancelTicketDialog: React.FC<CancelTicketDialogProps> = ({
  open,
  onOpenChange,
  cancelReason,
  setCancelReason,
  handleCancelTicket
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCancelTicket();
  };

  const isDisabled = !cancelReason || cancelReason.trim() === '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancelar Ticket</DialogTitle>
          <DialogDescription>
            Ingrese el motivo por el que se cancela este ticket.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-left">
                Motivo de cancelación
              </Label>
              <Textarea
                id="reason"
                placeholder="Ingrese el motivo de la cancelación..."
                value={cancelReason || ''} // Handle null/undefined
                onChange={(e) => setCancelReason(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="destructive"
              disabled={isDisabled}
            >
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelTicketDialog;
