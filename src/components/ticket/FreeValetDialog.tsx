
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import { Customer } from '@/lib/types';

interface FreeValetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  foundCustomer: Customer | null;
  setUseFreeValet: (value: boolean) => void;
  setValetQuantity: (value: number) => void;
}

export const FreeValetDialog: React.FC<FreeValetDialogProps> = ({
  open,
  onOpenChange,
  foundCustomer,
  setUseFreeValet,
  setValetQuantity
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usar Valet Gratis</AlertDialogTitle>
          <AlertDialogDescription>
            {foundCustomer?.name} tiene {foundCustomer?.freeValets} valet{foundCustomer?.freeValets !== 1 ? 's' : ''} gratis disponible{foundCustomer?.freeValets !== 1 ? 's' : ''}.
            ¿Desea utilizar 1 valet gratis para este ticket?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            onOpenChange(false);
            setUseFreeValet(false);
          }}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            setUseFreeValet(true);
            onOpenChange(false);
            // Al usar valet gratis, forzamos cantidad 1
            setValetQuantity(1);
            toast.success('Valet gratis aplicado al ticket');
          }}>
            Usar Valet Gratis
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
