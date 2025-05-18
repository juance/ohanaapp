import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LaundryOption, Ticket } from '@/lib/types';

import { useTicketForm } from '@/hooks/useTicketForm';
import { useCustomerLookup } from '@/hooks/useCustomerLookup';
import { useTicketPrice } from '@/hooks/useTicketPrice';

import FormHeader from './FormHeader';
import CustomerSection from './CustomerSection';
import ServiceTabsContainer from './ServiceTabsContainer';
import FormSubmitSection from './FormSubmitSection';
import { FreeValetDialog } from './FreeValetDialog';

interface TicketFormContainerProps {
  onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void;
}

interface TicketFormState {
  customerName: string;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  valetQuantity: number;
  setValetQuantity: React.Dispatch<React.SetStateAction<number>>;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  paymentMethod: string;
  handlePaymentMethodChange: (method: string) => void;
  separateByColor: boolean;
  setSeparateByColor: React.Dispatch<React.SetStateAction<boolean>>;
  delicateDry: boolean;
  setDelicateDry: React.Dispatch<React.SetStateAction<boolean>>;
  stainRemoval: boolean;
  setStainRemoval: React.Dispatch<React.SetStateAction<boolean>>;
  bleach: boolean;
  setBleach: React.Dispatch<React.SetStateAction<boolean>>;
  noFragrance: boolean;
  setNoFragrance: React.Dispatch<React.SetStateAction<boolean>>;
  noDry: boolean;
  setNoDry: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDryCleaningItems: string[];
  setSelectedDryCleaningItems: React.Dispatch<React.SetStateAction<string[]>>;
  lookupPhone: string;
  setLookupPhone: React.Dispatch<React.SetStateAction<string>>;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  foundCustomer: string;
  setFoundCustomer: React.Dispatch<React.SetStateAction<string>>;
  useFreeValet: boolean;
  setUseFreeValet: React.Dispatch<React.SetStateAction<boolean>>;
  showFreeValetDialog: boolean;
  setShowFreeValetDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isPaidInAdvance: boolean;
  setIsPaidInAdvance: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetCustomerForm: () => void;
}

export const TicketFormContainer: React.FC<TicketFormContainerProps> = ({
  onTicketGenerated
}) => {
  const {
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    valetQuantity,
    setValetQuantity,
    totalPrice,
    setTotalPrice,
    paymentMethod,
    handlePaymentMethodChange,
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
    setNoDry,
    selectedDryCleaningItems,
    setSelectedDryCleaningItems,
    lookupPhone,
    setLookupPhone,
    date,
    setDate,
    activeTab,
    setActiveTab,
    foundCustomer,
    setFoundCustomer,
    useFreeValet,
    setUseFreeValet,
    showFreeValetDialog,
    setShowFreeValetDialog,
    isPaidInAdvance,
    setIsPaidInAdvance,
    handleSubmit,
    resetCustomerForm
  } = useTicketForm(onTicketGenerated);

  const { handleCustomerLookup } = useCustomerLookup(
    setCustomerName,
    setPhoneNumber,
    setFoundCustomer,
    setUseFreeValet,
    setShowFreeValetDialog,
    activeTab
  );

  // Use the price calculation hook
  useTicketPrice(
    activeTab,
    valetQuantity,
    useFreeValet,
    selectedDryCleaningItems,
    setTotalPrice
  );

  const handleLookupCustomer = () => handleCustomerLookup(lookupPhone);

  return (
    <Card>
      <FormHeader />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer information section */}
          <CustomerSection 
            customerName={customerName}
            setCustomerName={setCustomerName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            lookupPhone={lookupPhone}
            setLookupPhone={setLookupPhone}
            handleCustomerLookup={handleLookupCustomer}
            foundCustomer={foundCustomer}
            activeTab={activeTab}
            useFreeValet={useFreeValet}
            setShowFreeValetDialog={setShowFreeValetDialog}
            date={date}
            setDate={setDate}
          />
          
          {/* Service Type Tabs */}
          <ServiceTabsContainer 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            valetQuantity={valetQuantity}
            setValetQuantity={setValetQuantity}
            paymentMethod={paymentMethod}
            handlePaymentMethodChange={handlePaymentMethodChange}
            totalPrice={totalPrice}
            useFreeValet={useFreeValet}
            setUseFreeValet={setUseFreeValet} // Add the missing prop here
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
            selectedDryCleaningItems={selectedDryCleaningItems}
            setSelectedDryCleaningItems={setSelectedDryCleaningItems}
          />
          
          <FormSubmitSection 
            isPaidInAdvance={isPaidInAdvance}
            setIsPaidInAdvance={setIsPaidInAdvance}
          />
        </form>
      </CardContent>

      {/* Dialog de confirmación para usar valet gratis */}
      <FreeValetDialog 
        isOpen={showFreeValetDialog}
        onClose={() => setShowFreeValetDialog(false)}
        customer={foundCustomer}
        onSuccess={() => {
          setUseFreeValet(true);
          setValetQuantity(1);
        }}
      />
    </Card>
  );
};

export default TicketFormContainer;
