
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Customer } from '@/lib/types';
import { useFreeValet } from '@/hooks/useFreeValet';

interface FreeValetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSuccess: () => void;
}

export function FreeValetDialog({ isOpen, onClose, customer, onSuccess }: FreeValetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { useFreeValetForCustomer } = useFreeValet();

  const handleRedeemFreeValet = async () => {
    if (!customer) return;
    
    try {
      setIsSubmitting(true);
      await useFreeValetForCustomer(customer);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error redeeming free valet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Usar Valet Gratis</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas usar un valet gratis para {customer.name}?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">
            El cliente actualmente tiene <span className="font-medium">{customer.freeValets || 0}</span> vales gratis disponibles.
          </p>
          {(customer.freeValets || 0) <= 0 && (
            <p className="text-sm text-red-500 mt-2">
              Este cliente no tiene vales gratis disponibles.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRedeemFreeValet}
            disabled={isSubmitting || (customer.freeValets || 0) <= 0}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
