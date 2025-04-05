
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Gift } from 'lucide-react';
import { Customer } from '@/lib/types';

interface CustomerLookupProps {
  lookupPhone: string;
  setLookupPhone: (value: string) => void;
  handleCustomerLookup: () => void;
  foundCustomer: Customer | null;
  activeTab: string;
  useFreeValet: boolean;
  setShowFreeValetDialog: (value: boolean) => void;
}

export const CustomerLookup: React.FC<CustomerLookupProps> = ({
  lookupPhone,
  setLookupPhone,
  handleCustomerLookup,
  foundCustomer,
  activeTab,
  useFreeValet,
  setShowFreeValetDialog
}) => {
  return (
    <>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="lookupPhone">Buscar Cliente</Label>
          <Input 
            id="lookupPhone" 
            value={lookupPhone} 
            onChange={(e) => setLookupPhone(e.target.value)} 
            placeholder="Buscar por teléfono"
            className="mt-1"
          />
        </div>
        <Button 
          type="button" 
          onClick={handleCustomerLookup}
          variant="outline"
        >
          Buscar
        </Button>
      </div>
      
      {/* Mostrar información de valets del cliente si fue encontrado */}
      {foundCustomer && activeTab === 'valet' && (
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <h3 className="font-medium text-blue-800 flex items-center mb-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            Información del Cliente
          </h3>
          <p className="text-sm text-blue-700">
            Valets acumulados: <strong>{foundCustomer.valetsCount}</strong>
          </p>
          {foundCustomer.freeValets > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <Gift className="h-4 w-4 text-blue-700" />
              <p className="text-sm font-bold text-blue-700">
                Valets gratis disponibles: {foundCustomer.freeValets}
              </p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="ml-auto h-7"
                onClick={() => setShowFreeValetDialog(true)}
              >
                Usar valet gratis
              </Button>
            </div>
          )}
          {useFreeValet && (
            <div className="mt-2 p-2 bg-green-100 rounded text-sm text-green-800 font-medium">
              ✓ Usando 1 valet gratis en este ticket
            </div>
          )}
        </div>
      )}
    </>
  );
};
