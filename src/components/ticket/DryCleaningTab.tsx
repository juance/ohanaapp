
import React from 'react';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PriceDisplay } from './PriceDisplay';
import DryCleaningOptions, { SelectedDryCleaningItem } from '@/components/DryCleaningOptions';
import { PaymentMethod } from '@/lib/types';

interface DryCleaningTabProps {
  paymentMethod: PaymentMethod;
  handlePaymentMethodChange: (value: PaymentMethod) => void;
  totalPrice: number;
  selectedDryCleaningItems: SelectedDryCleaningItem[];
  setSelectedDryCleaningItems: (items: SelectedDryCleaningItem[]) => void;
}

export const DryCleaningTab: React.FC<DryCleaningTabProps> = ({
  paymentMethod,
  handlePaymentMethodChange,
  totalPrice,
  selectedDryCleaningItems,
  setSelectedDryCleaningItems
}) => {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row items-end mb-6">
        <div className="w-full sm:w-1/2">
          <PaymentMethodSelector 
            value={paymentMethod} 
            onChange={handlePaymentMethodChange} 
          />
        </div>
        <div className="w-full sm:w-1/2">
          <PriceDisplay totalPrice={totalPrice} />
        </div>
      </div>
      
      <DryCleaningOptions 
        selectedItems={selectedDryCleaningItems}
        onItemsChange={setSelectedDryCleaningItems}
      />
    </>
  );
};
