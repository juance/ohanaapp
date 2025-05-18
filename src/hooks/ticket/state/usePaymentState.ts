
import { useState } from 'react';
import { PaymentMethod } from '@/lib/types';  // Updated import

export const usePaymentState = () => {
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  
  // Handle payment method change
  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setPaymentMethod(value);
  };
  
  // Reset payment state
  const resetPaymentState = () => {
    setPaymentMethod('cash');
  };

  return {
    paymentMethod,
    setPaymentMethod,
    handlePaymentMethodChange,
    resetPaymentState
  };
};
