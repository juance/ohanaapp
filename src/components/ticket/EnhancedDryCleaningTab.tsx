
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PriceDisplay } from './PriceDisplay';
import EnhancedDryCleaningOptions from './services/EnhancedDryCleaningOptions';
import { SelectedService } from './services/DryCleaningServiceCard';
import { PaymentMethod } from '@/lib/types';

interface EnhancedDryCleaningTabProps {
  paymentMethod: PaymentMethod;
  handlePaymentMethodChange: (value: PaymentMethod) => void;
  totalPrice: number;
  selectedDryCleaningItems: SelectedService[];
  setSelectedDryCleaningItems: (items: SelectedService[]) => void;
}

const EnhancedDryCleaningTab: React.FC<EnhancedDryCleaningTabProps> = ({
  paymentMethod,
  handlePaymentMethodChange,
  totalPrice,
  selectedDryCleaningItems,
  setSelectedDryCleaningItems
}) => {
  return (
    <div className="space-y-6">
      <EnhancedDryCleaningOptions
        selectedItems={selectedDryCleaningItems}
        onItemsChange={setSelectedDryCleaningItems}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Método de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total a Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceDisplay 
              totalPrice={totalPrice}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDryCleaningTab;
