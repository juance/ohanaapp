
import { useState } from 'react';
import { PaymentMethod } from '@/lib/types';

export const useTicketFormState = () => {
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  
  // Total price
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Active tab
  const [activeTab, setActiveTab] = useState('valet');
  
  // Date selection
  const [date, setDate] = useState<Date>(new Date());
  
  // Handle payment method change
  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setPaymentMethod(value);
  };
  
  // Reset ticket form state
  const resetTicketFormState = () => {
    setPaymentMethod('cash');
    setTotalPrice(0);
    setActiveTab('valet');
    setDate(new Date());
  };

  return {
    paymentMethod,
    setPaymentMethod,
    handlePaymentMethodChange,
    totalPrice,
    setTotalPrice,
    activeTab,
    setActiveTab,
    date,
    setDate,
    resetTicketFormState
  };
};
