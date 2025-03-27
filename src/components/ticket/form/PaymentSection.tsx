
import React from 'react';
import { PaymentMethod } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';

interface PaymentSectionProps {
  isPaidInAdvance: boolean;
  setIsPaidInAdvance: (value: boolean) => void;
  totalPrice: number;
  paymentMethod: PaymentMethod;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  isPaidInAdvance,
  setIsPaidInAdvance,
  totalPrice,
  paymentMethod
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="paidInAdvance"
          checked={isPaidInAdvance}
          onChange={() => setIsPaidInAdvance(!isPaidInAdvance)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="paidInAdvance" className="text-sm font-medium">
          Cliente dejó pago (Pagado por adelantado)
        </label>
      </div>
      
      <div className="text-lg font-medium">
        Total: <span className="text-blue-600">${totalPrice}</span> ({paymentMethod})
      </div>
    </div>
  );
};
