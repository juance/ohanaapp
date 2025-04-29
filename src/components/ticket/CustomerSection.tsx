import React from 'react';
import { Separator } from '@/components/ui/separator';
import { CustomerForm } from './CustomerForm';
import { CustomerLookup } from './CustomerLookup';
import { DateSelector } from './DateSelector';
import { Customer } from '@/lib/types/customer.types';

interface CustomerSectionProps {
  customerName: string;
  setCustomerName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  lookupPhone: string;
  setLookupPhone: (value: string) => void;
  handleCustomerLookup: () => void;
  foundCustomer: Customer | null;
  activeTab: string;
  useFreeValet: boolean;
  setShowFreeValetDialog: (value: boolean) => void;
  date: Date;
  setDate: (date: Date) => void;
}

const CustomerSection: React.FC<CustomerSectionProps> = ({
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber,
  lookupPhone,
  setLookupPhone,
  handleCustomerLookup,
  foundCustomer,
  activeTab,
  useFreeValet,
  setShowFreeValetDialog,
  date,
  setDate
}) => {
  return (
    <div className="space-y-4">
      <CustomerForm 
        customerName={customerName}
        setCustomerName={setCustomerName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />
      
      <CustomerLookup 
        lookupPhone={lookupPhone}
        setLookupPhone={setLookupPhone}
        handleCustomerLookup={handleCustomerLookup}
        foundCustomer={foundCustomer}
        activeTab={activeTab}
        useFreeValet={useFreeValet}
        setShowFreeValetDialog={setShowFreeValetDialog}
      />
      
      <Separator className="my-4" />
      
      <DateSelector date={date} setDate={setDate} />
      
      <Separator className="my-4" />
    </div>
  );
};

export default CustomerSection;
