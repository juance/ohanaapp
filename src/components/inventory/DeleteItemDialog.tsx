
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { InventoryItem } from '@/lib/types';

interface DeleteItemDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentItem: InventoryItem | null;
  handleDeleteItem: () => Promise<void>;
}

const DeleteItemDialog: React.FC<DeleteItemDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  currentItem, 
  handleDeleteItem 
}) => {
  if (!currentItem) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
        </DialogHeader>
        <p>
          ¿Está seguro de que desea eliminar el producto 
          <span className="font-semibold"> {currentItem.name}</span>?
          Esta acción no se puede deshacer.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDeleteItem}>
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItemDialog;
