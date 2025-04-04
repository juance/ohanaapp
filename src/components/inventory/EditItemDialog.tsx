
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { InventoryItem } from '@/lib/types';

interface EditItemDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentItem: InventoryItem | null;
  setCurrentItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
  handleEditItem: () => Promise<void>;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  currentItem, 
  setCurrentItem, 
  handleEditItem 
}) => {
  if (!currentItem) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre del Producto</Label>
            <Input
              id="edit-name"
              value={currentItem.name}
              onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Cantidad</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="0"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-threshold">Stock Mínimo</Label>
              <Input
                id="edit-threshold"
                type="number"
                min="0"
                value={currentItem.threshold}
                onChange={(e) => setCurrentItem({...currentItem, threshold: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-unit">Unidad</Label>
            <Input
              id="edit-unit"
              value={currentItem.unit}
              onChange={(e) => setCurrentItem({...currentItem, unit: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleEditItem}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
