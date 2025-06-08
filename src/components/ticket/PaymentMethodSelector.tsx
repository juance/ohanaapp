
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethod } from '@/lib/types/ticket.types';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  value, 
  onChange 
}) => (
  <div>
    <Label htmlFor="paymentMethod">Método de Pago</Label>
    <Select 
      value={value} 
      onValueChange={onChange as (value: string) => void}
    >
      <SelectTrigger id="paymentMethod" className="mt-1">
        <SelectValue placeholder="Método de pago" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cash">Efectivo</SelectItem>
        <SelectItem value="debit">Tarjeta de Débito</SelectItem>
        <SelectItem value="mercadopago">Mercado Pago</SelectItem>
        <SelectItem value="cuenta_dni">Cuenta DNI</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
