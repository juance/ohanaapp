
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PaymentMethod } from '@/lib/types';

interface PaymentMethodOption {
  id: string;
  label: string;
}

interface PaymentSectionProps {
  paymentMethods: PaymentMethodOption[];
  paymentMethod: PaymentMethod;
  setPaymentMethod: (value: PaymentMethod) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentMethods,
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Payment Method</h3>
      <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                paymentMethod === method.id
                  ? 'border-laundry-500 bg-laundry-50'
                  : 'border-border'
              }`}
              onClick={() => setPaymentMethod(method.id as PaymentMethod)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={method.id}
                  id={`payment-${method.id}`}
                  className="data-[state=checked]:border-laundry-500 data-[state=checked]:text-laundry-500"
                />
                <Label
                  htmlFor={`payment-${method.id}`}
                  className="cursor-pointer text-sm font-medium"
                >
                  {method.label}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentSection;
