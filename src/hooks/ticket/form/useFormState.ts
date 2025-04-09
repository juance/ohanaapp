
import { useState } from 'react';
import { PaymentMethod } from '@/lib/types';

export const useFormState = () => {
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDryCleaningItems, setSelectedDryCleaningItems] = useState<{id: string, quantity: number}[]>([]);
  const [selectedLaundryOptions, setSelectedLaundryOptions] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setClientName('');
    setPhoneNumber('');
    setSelectedServices([]);
    setSelectedDryCleaningItems([]);
    setSelectedLaundryOptions([]);
    setPaymentMethod('cash');
  };

  return {
    clientName,
    setClientName,
    phoneNumber,
    setPhoneNumber,
    selectedServices,
    setSelectedServices,
    selectedDryCleaningItems,
    setSelectedDryCleaningItems,
    selectedLaundryOptions,
    setSelectedLaundryOptions,
    paymentMethod,
    setPaymentMethod,
    isSubmitting,
    setIsSubmitting,
    resetForm
  };
};
