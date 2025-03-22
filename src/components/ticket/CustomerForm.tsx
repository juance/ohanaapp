
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerFormProps {
  customerName: string;
  setCustomerName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Label htmlFor="customerName">Nombre del Cliente</Label>
        <Input 
          id="customerName" 
          value={customerName} 
          onChange={(e) => setCustomerName(e.target.value)} 
          placeholder="Nombre completo"
          className="mt-1"
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="phoneNumber">Teléfono</Label>
        <Input 
          id="phoneNumber" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          placeholder="+549 número"
          className="mt-1"
        />
      </div>
    </div>
  );
};
