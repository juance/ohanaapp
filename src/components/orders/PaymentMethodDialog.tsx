
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/lib/types';

interface PaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketNumber: string;
  currentPaymentMethod?: string;
  onPaymentMethodChanged: () => void;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  isOpen,
  onClose,
  ticketId,
  ticketNumber,
  currentPaymentMethod = 'cash',
  onPaymentMethodChanged
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(currentPaymentMethod as PaymentMethod);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdatePaymentMethod = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ payment_method: paymentMethod })
        .eq('id', ticketId);

      if (error) throw error;
      
      toast.success('Método de pago actualizado');
      onPaymentMethodChanged();
      onClose();
    } catch (error) {
      console.error('Error al actualizar método de pago:', error);
      toast.error('Error al actualizar método de pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cambiar método de pago - Ticket #{ticketNumber}</AlertDialogTitle>
          <AlertDialogDescription>
            Seleccione el nuevo método de pago para este ticket.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="paymentMethod">Método de pago</Label>
          <Select
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          >
            <SelectTrigger id="paymentMethod" className="w-full mt-2">
              <SelectValue placeholder="Seleccionar método de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Efectivo</SelectItem>
              <SelectItem value="debit">Tarjeta de Débito</SelectItem>
              <SelectItem value="mercadopago">MercadoPago</SelectItem>
              <SelectItem value="cuenta_dni">Cuenta DNI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleUpdatePaymentMethod();
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

export default PaymentMethodDialog;
