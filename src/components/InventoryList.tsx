
import React, { useState } from 'react';
import { InventoryItemWithTimestamp, InventoryItemFormState } from '@/lib/types/inventory-ui.types';
import InventorySearch from '@/components/inventory/InventorySearch';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryItemForm from '@/components/inventory/InventoryItemForm';
import DeleteItemDialog from '@/components/inventory/DeleteItemDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInventory } from '@/hooks/useInventory';
import { toast } from 'sonner';

const InventoryList: React.FC = () => {
  const { 
    items: filteredItems,
    isCreating,
    isUpdating,
    isDeleting,
    createItem,
    updateItem,
    deleteItem
  } = useInventory();
  
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<InventoryItemWithTimestamp | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItemWithTimestamp | null>(null);

  const handleSearch = (query: string) => {
    // Using the search functionality from useInventory hook
    // This is handled by the InventorySearch component directly
  };

  const handleCreateNew = () => {
    setCurrentItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: InventoryItemWithTimestamp) => {
    setCurrentItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: InventoryItemWithTimestamp) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(itemToDelete.id);
      toast.success('Ítem eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el ítem');
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (formData: InventoryItemFormState): Promise<void> => {
    try {
      if (currentItem) {
        // Update existing item
        await updateItem({
          ...currentItem,
          ...formData
        });
        toast.success('Ítem actualizado correctamente');
      } else {
        // Add new item
        await createItem(formData);
        toast.success('Ítem añadido correctamente');
      }
      
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Error al guardar el ítem');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
      </div>
      
      <InventorySearch
        onSearch={handleSearch}
        onCreateNew={handleCreateNew}
      />
      
      <InventoryTable
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentItem ? 'Editar' : 'Crear'} Ítem</DialogTitle>
          </DialogHeader>
          <InventoryItemForm
            initialData={currentItem || {
              name: '',
              quantity: 0,
              unit: '',
              threshold: 0,
              notes: ''
            }}
            isSubmitting={isCreating || isUpdating}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <DeleteItemDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default InventoryList;
