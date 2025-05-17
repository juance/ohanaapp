
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InventoryItemFormState } from '@/lib/types/inventory-ui.types';

interface InventoryItemFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formState: InventoryItemFormState;
  setFormState: React.Dispatch<React.SetStateAction<InventoryItemFormState>>;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
  isOpen,
  onOpenChange,
  title,
  formState,
  setFormState,
  onSubmit,
  isSubmitting,
  submitLabel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              type="text"
              id="name"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Cantidad
            </Label>
            <Input
              type="number"
              id="quantity"
              value={formState.quantity}
              onChange={(e) =>
                setFormState({ ...formState, quantity: Number(e.target.value) })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              Unidad
            </Label>
            <Input
              type="text"
              id="unit"
              value={formState.unit}
              onChange={(e) => setFormState({ ...formState, unit: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="threshold" className="text-right">
              Umbral
            </Label>
            <Input
              type="number"
              id="threshold"
              value={formState.threshold}
              onChange={(e) =>
                setFormState({ ...formState, threshold: Number(e.target.value) })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notas
            </Label>
            <Input
              type="text"
              id="notes"
              value={formState.notes}
              onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryItemForm;
