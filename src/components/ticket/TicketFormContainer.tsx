
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LaundryOption, Ticket } from '@/lib/types';

import { useTicketForm } from '@/hooks/useTicketForm';
import { useCustomerLookup } from '@/hooks/useCustomerLookup';
import { useTicketPrice } from '@/hooks/useTicketPrice';

import { FreeValetDialog } from './FreeValetDialog';
import { TicketFormHeader } from './form/TicketFormHeader';
import { FormTabs } from './form/FormTabs';
import { PaymentSection } from './form/PaymentSection';
import { SubmitButton } from './form/SubmitButton';

interface TicketFormContainerProps {
  onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void;
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
    isSubmitting
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

  const onLookupCustomer = () => handleCustomerLookup(lookupPhone);

  return (
    <Card>
      <CardHeader>
        <TicketFormHeader />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Tabs with Customer Information and Service Selection */}
          <FormTabs 
            customerName={customerName}
            setCustomerName={setCustomerName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            lookupPhone={lookupPhone}
            setLookupPhone={setLookupPhone}
            handleCustomerLookup={onLookupCustomer}
            foundCustomer={foundCustomer}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            date={date}
            setDate={setDate}
            useFreeValet={useFreeValet}
            setUseFreeValet={setUseFreeValet}
            showFreeValetDialog={showFreeValetDialog}
            setShowFreeValetDialog={setShowFreeValetDialog}
            valetQuantity={valetQuantity}
            setValetQuantity={setValetQuantity}
            paymentMethod={paymentMethod}
            handlePaymentMethodChange={handlePaymentMethodChange}
            totalPrice={totalPrice}
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
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Payment and Total Section */}
            <PaymentSection 
              isPaidInAdvance={isPaidInAdvance}
              setIsPaidInAdvance={setIsPaidInAdvance}
              totalPrice={totalPrice}
              paymentMethod={paymentMethod}
            />
            
            {/* Submit Button */}
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </CardContent>

      {/* Dialog for free valet confirmation */}
      <FreeValetDialog 
        open={showFreeValetDialog}
        onOpenChange={setShowFreeValetDialog}
        foundCustomer={foundCustomer}
        setUseFreeValet={setUseFreeValet}
        setValetQuantity={setValetQuantity}
      />
    </Card>
  );
};
