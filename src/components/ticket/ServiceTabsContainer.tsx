import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ValetTab } from './ValetTab';
import { DryCleaningTab } from './DryCleaningTab';
import { SelectedDryCleaningItem } from '@/components/DryCleaningOptions';
import { PaymentMethod } from '@/lib/types'; // Updated import

interface ServiceTabsContainerProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  valetQuantity: number;
  setValetQuantity: (value: number) => void;
  paymentMethod: PaymentMethod;
  handlePaymentMethodChange: (value: PaymentMethod) => void;
  totalPrice: number;
  useFreeValet: boolean;
  setUseFreeValet: (value: boolean) => void; // Ensure this prop is defined in the interface
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

const ServiceTabsContainer: React.FC<ServiceTabsContainerProps> = ({
  activeTab,
  setActiveTab,
  valetQuantity,
  setValetQuantity,
  paymentMethod,
  handlePaymentMethodChange,
  totalPrice,
  useFreeValet,
  setUseFreeValet, // Add this to the destructured props
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
  );
};

export default ServiceTabsContainer;
