
import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { AlertCircle, Gift } from 'lucide-react';
import { Customer } from '@/lib/types/customer.types';
import { useCustomerFreeValet } from '@/lib/services/loyaltyService';
import { toast } from '@/lib/toast';

interface FreeValetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSuccess?: () => void;
}

export const FreeValetDialog: React.FC<FreeValetDialogProps> = ({
  isOpen,
  onClose,
  customer,
  onSuccess
}) => {
  // Extract customer info
  const foundCustomer = customer;
  const freeValets = foundCustomer?.freeValets || 0;
  
  // State setters passed from parent
  const setUseFreeValet = (value: boolean) => {
    if (onSuccess && value) {
      onSuccess();
    }
  };
  
  // Close handler
  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };
  
  // Set valet quantity to 1 when using free valet
  const setValetQuantity = (quantity: number) => {
    // This is handled in the onSuccess callback
  };

  if (!foundCustomer || freeValets <= 0) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Gift className="h-5 w-5 mr-2 text-blue-600" />
            Usar Valet Gratis
          </AlertDialogTitle>
          <AlertDialogDescription>
            El cliente <strong>{foundCustomer.name}</strong> tiene <strong>{freeValets}</strong> valet{freeValets !== 1 && 's'} gratis disponible{freeValets !== 1 && 's'}.
            <br /><br />
            ¿Desea aplicar un valet gratis a este ticket?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            if (foundCustomer) {
              // Llamar al servicio para usar un valet gratis
              const { useFreeValet } = useCustomerFreeValet(foundCustomer.id, () => {
                setUseFreeValet(true);
                onOpenChange(false);
                // Al usar valet gratis, forzamos cantidad 1
                setValetQuantity(1);
                toast.success('Valet gratis aplicado al ticket');
              });
              const success = await useFreeValet();

              if (!success) {
                // Si falla, no aplicamos el valet gratis
                setUseFreeValet(false);
                onOpenChange(false);
              }
            }
          }}>
            Aplicar Valet Gratis
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
