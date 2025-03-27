
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface NewItem {
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
}

interface AddItemDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newItem: NewItem;
  setNewItem: React.Dispatch<React.SetStateAction<NewItem>>;
  handleAddItem: () => Promise<void>;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  newItem, 
  setNewItem, 
  handleAddItem 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Producto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Stock Mínimo</Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                value={newItem.threshold}
                onChange={(e) => setNewItem({...newItem, threshold: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unidad</Label>
            <Input
              id="unit"
              value={newItem.unit}
              onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
              placeholder="kg, litros, unidades, etc."
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
