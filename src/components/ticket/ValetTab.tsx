
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PriceDisplay } from './PriceDisplay';
import { LaundryOptions } from './LaundryOptions';
import { PaymentMethod } from '@/lib/types';

interface ValetTabProps {
  valetQuantity: number;
  setValetQuantity: (value: number) => void;
  paymentMethod: PaymentMethod;
  handlePaymentMethodChange: (value: PaymentMethod) => void;
  totalPrice: number;
  useFreeValet: boolean;
  separateByColor: boolean;
  setSeparateByColor: (value: boolean) => void;
  delicateDry: boolean;
  setDelicateDry: (value: boolean) => void;
  stainRemoval: boolean;
  setStainRemoval: (value: boolean) => void;
  bleach: boolean;
  setBleach: (value: boolean) => void;
  noFragrance: boolean;
  setNoFragrance: (value: boolean) => void;
  noDry: boolean;
  setNoDry: (value: boolean) => void;
}

export const ValetTab: React.FC<ValetTabProps> = ({
  valetQuantity,
  setValetQuantity,
  paymentMethod,
  handlePaymentMethodChange,
  totalPrice,
  useFreeValet,
  separateByColor,
  setSeparateByColor,
  delicateDry,
  setDelicateDry,
  stainRemoval,
  setStainRemoval,
  bleach,
  setBleach,
  noFragrance,
  setNoFragrance,
  noDry,
  setNoDry
}) => {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row items-end">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="valetQuantity">Cantidad de Valets</Label>
          <Input 
            id="valetQuantity" 
            type="number" 
            min="1"
            value={valetQuantity}
            onChange={(e) => setValetQuantity(parseInt(e.target.value) || 1)}
            className="mt-1"
            disabled={useFreeValet} // Deshabilitar si se usa valet gratis
          />
        </div>
        <div className="w-full sm:w-1/3">
          <PaymentMethodSelector 
            value={paymentMethod} 
            onChange={handlePaymentMethodChange} 
          />
        </div>
        <div className="w-full sm:w-1/3">
          <PriceDisplay totalPrice={totalPrice} />
        </div>
      </div>
      
      <LaundryOptions
        separateByColor={separateByColor}
        setSeparateByColor={setSeparateByColor}
        delicateDry={delicateDry}
        setDelicateDry={setDelicateDry}
        stainRemoval={stainRemoval}
        setStainRemoval={setStainRemoval}
        bleach={bleach}
        setBleach={setBleach}
        noFragrance={noFragrance}
        setNoFragrance={setNoFragrance}
        noDry={noDry}
        setNoDry={setNoDry}
      />
    </>
  );
};
