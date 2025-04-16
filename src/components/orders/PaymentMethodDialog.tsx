import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PaymentMethodSelector } from '@/components/ticket/PaymentMethodSelector';
import { PaymentMethod } from '@/lib/types';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPaymentMethod: PaymentMethod;
  onConfirm: (paymentMethod: PaymentMethod) => void;
  ticketNumber: string;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  currentPaymentMethod,
  onConfirm,
  ticketNumber
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(currentPaymentMethod);

  const handleConfirm = () => {
    onConfirm(paymentMethod);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Método de Pago</DialogTitle>
          <DialogDescription>
            Actualizar el método de pago para el ticket #{ticketNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <PaymentMethodSelector 
            value={paymentMethod} 
            onChange={(value) => setPaymentMethod(value)} 
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
