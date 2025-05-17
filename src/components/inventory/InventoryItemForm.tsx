
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InventoryItemFormState, InventoryItemWithTimestamp } from '@/lib/types/inventory-ui.types';

interface InventoryItemFormProps {
  initialData: InventoryItemWithTimestamp | InventoryItemFormState;
  isSubmitting: boolean;
  onSubmit: (formData: InventoryItemFormState) => Promise<void>;
  onCancel: () => void;
}

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  const [formState, setFormState] = React.useState<InventoryItemFormState>({
    name: initialData.name || '',
    quantity: initialData.quantity || 0,
    unit: initialData.unit || '',
    threshold: initialData.threshold || 0,
    notes: initialData.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          required
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
          required
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
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryItemForm;
