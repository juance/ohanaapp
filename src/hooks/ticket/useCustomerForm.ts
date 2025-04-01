
import { useState } from 'react';
import { Customer } from '@/lib/types';

export const useCustomerForm = () => {
  // Customer information
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Customer lookup
  const [lookupPhone, setLookupPhone] = useState('');
  
  // Customer details after lookup
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  
  // Reset customer form data
  const resetCustomerForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setLookupPhone('');
    setFoundCustomer(null);
  };

  return {
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    lookupPhone,
    setLookupPhone,
    foundCustomer,
    setFoundCustomer,
    resetCustomerForm
  };
};
