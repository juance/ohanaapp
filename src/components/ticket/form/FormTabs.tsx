
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CustomerForm } from '../CustomerForm';
import { CustomerLookup } from '../CustomerLookup';
import { DateSelector } from '../DateSelector';
import { ValetTab } from '../ValetTab';
import { DryCleaningTab } from '../DryCleaningTab';
import { Customer, PaymentMethod } from '@/lib/types';
import { SelectedDryCleaningItem } from '@/components/ticket-form/types';

interface FormTabsProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  lookupPhone: string;
  setLookupPhone: (phone: string) => void;
  handleCustomerLookup: () => void;
  foundCustomer: Customer | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  date: Date;
  setDate: (date: Date) => void;
  useFreeValet: boolean;
  setUseFreeValet: (use: boolean) => void;
  showFreeValetDialog: boolean;
  setShowFreeValetDialog: (show: boolean) => void;
  valetQuantity: number;
  setValetQuantity: (quantity: number) => void;
  paymentMethod: PaymentMethod;
  handlePaymentMethodChange: (method: PaymentMethod) => void;
  totalPrice: number;
  separateByColor: boolean;
  setSeparateByColor: (value: boolean) => void;
  delicateDry: boolean;
  setDelicateDry: (value: boolean) => void;
  stainRemoval: boolean;
  setStainRemoval: (value: boolean) => void;
  bleach: boolean;
  setBleach: (value: boolean) => void;
  noFragrance: boolean;
  setNoFragrance: (value: boolean) => void;
  noDry: boolean;
  setNoDry: (value: boolean) => void;
  selectedDryCleaningItems: SelectedDryCleaningItem[];
  setSelectedDryCleaningItems: (items: SelectedDryCleaningItem[]) => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber,
  lookupPhone,
  setLookupPhone,
  handleCustomerLookup,
  foundCustomer,
  activeTab,
  setActiveTab,
  date,
  setDate,
  useFreeValet,
  setUseFreeValet,
  showFreeValetDialog,
  setShowFreeValetDialog,
  valetQuantity,
  setValetQuantity,
  paymentMethod,
  handlePaymentMethodChange,
  totalPrice,
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
  setSelectedDryCleaningItems
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
  );
};
