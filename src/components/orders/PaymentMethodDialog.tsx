
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPaymentMethod: string;
  onConfirm: (method: string) => void;
  ticketNumber: string;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  currentPaymentMethod,
  onConfirm,
  ticketNumber
}) => {
  const [paymentMethod, setPaymentMethod] = useState(currentPaymentMethod);

  const handleConfirm = () => {
    onConfirm(paymentMethod);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Método de Pago</DialogTitle>
          <DialogDescription>
            Seleccione el método de pago para el ticket #{ticketNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Efectivo</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="debit" id="debit" />
              <Label htmlFor="debit">Tarjeta de Débito</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="credit" id="credit" />
              <Label htmlFor="credit">Tarjeta de Crédito</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="mercadopago" id="mercadopago" />
              <Label htmlFor="mercadopago">Mercado Pago</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cuentaDni" id="cuentaDni" />
              <Label htmlFor="cuentaDni">Cuenta DNI</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
