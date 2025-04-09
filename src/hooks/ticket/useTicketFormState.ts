
import { usePaymentState } from './state/usePaymentState';
import { usePriceState } from './state/usePriceState';
import { useTabState } from './state/useTabState';
import { useDateState } from './state/useDateState';
import { PaymentMethod } from '@/lib/types';

export const useTicketFormState = () => {
  // Use the smaller, focused hooks
  const { paymentMethod, setPaymentMethod, handlePaymentMethodChange, resetPaymentState } = usePaymentState();
  const { totalPrice, setTotalPrice, resetPriceState } = usePriceState();
  const { activeTab, setActiveTab, resetTabState } = useTabState();
  const { date, setDate, resetDateState } = useDateState();
  
  // Combine reset functions
  const resetTicketFormState = () => {
    resetPaymentState();
    resetPriceState();
    resetTabState();
    resetDateState();
  };

  return {
    // Payment method state
    paymentMethod,
    setPaymentMethod,
    handlePaymentMethodChange,
    
    // Price state
    totalPrice,
    setTotalPrice,
    
    // Tab state
    activeTab,
    setActiveTab,
    
    // Date state
    date,
    setDate,
    
    // Combined reset function
    resetTicketFormState
  };
};
