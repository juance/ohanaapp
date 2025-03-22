
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LaundryOption, Ticket } from '@/lib/types';

import { useTicketForm } from '@/hooks/useTicketForm';
import { useCustomerLookup } from '@/hooks/useCustomerLookup';
import { useTicketPrice } from '@/hooks/useTicketPrice';

import { CustomerForm } from './CustomerForm';
import { CustomerLookup } from './CustomerLookup';
import { DateSelector } from './DateSelector';
import { ValetTab } from './ValetTab';
import { DryCleaningTab } from './DryCleaningTab';
import { FreeValetDialog } from './FreeValetDialog';

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
    handleSubmit
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
      <CardHeader>
        <CardTitle className="text-xl">Formulario de Ticket</CardTitle>
        <CardDescription>Genere tickets para valets o tintorería</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer information section */}
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
              handleCustomerLookup={handleLookupCustomer}
              foundCustomer={foundCustomer}
              activeTab={activeTab}
              useFreeValet={useFreeValet}
              setShowFreeValetDialog={setShowFreeValetDialog}
            />
            
            <Separator className="my-4" />
            
            <DateSelector date={date} setDate={setDate} />
            
            <Separator className="my-4" />
            
            {/* Service Type Tabs */}
            <Tabs value={activeTab} onValueChange={(val) => {
              setActiveTab(val);
              // Resetear el uso de valet gratis al cambiar de pestaña
              setUseFreeValet(false);
            }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="valet">Valet</TabsTrigger>
                <TabsTrigger value="tintoreria">Tintorería</TabsTrigger>
              </TabsList>
              
              {/* Valet Tab Content */}
              <TabsContent value="valet" className="mt-4">
                <ValetTab 
                  valetQuantity={valetQuantity}
                  setValetQuantity={setValetQuantity}
                  paymentMethod={paymentMethod}
                  handlePaymentMethodChange={handlePaymentMethodChange}
                  totalPrice={totalPrice}
                  useFreeValet={useFreeValet}
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
                />
              </TabsContent>
              
              {/* Dry Cleaning Tab Content */}
              <TabsContent value="tintoreria" className="mt-4">
                <DryCleaningTab 
                  paymentMethod={paymentMethod}
                  handlePaymentMethodChange={handlePaymentMethodChange}
                  totalPrice={totalPrice}
                  selectedDryCleaningItems={selectedDryCleaningItems}
                  setSelectedDryCleaningItems={setSelectedDryCleaningItems}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Generar Ticket
          </Button>
        </form>
      </CardContent>

      {/* Dialog de confirmación para usar valet gratis */}
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
