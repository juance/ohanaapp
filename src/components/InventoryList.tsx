
import React, { useState } from 'react';
import { InventoryItemWithTimestamp, InventoryItemFormState } from '@/lib/types/inventory-ui.types';
import InventorySearch from '@/components/inventory/InventorySearch';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryItemForm from '@/components/inventory/InventoryItemForm';
import DeleteItemDialog from '@/components/inventory/DeleteItemDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { Alert, AlertDescription } from '@/components/ui/alert';

const InventoryList: React.FC = () => {
  const { 
    items: filteredItems,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createItem,
    updateItem,
    deleteItem,
    searchQuery,
    setSearchQuery
  } = useInventory();
  
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<InventoryItemWithTimestamp | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItemWithTimestamp | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
      console.log('Ítem eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el ítem:', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (formData: InventoryItemFormState): Promise<void> => {
    try {
      console.log('Submitting form data:', formData);
      
      if (currentItem) {
        // Update existing item
        const itemToUpdate = {
          id: currentItem.id,
          name: formData.name,
          quantity: formData.quantity,
          unit: formData.unit || 'unidad',
          threshold: formData.threshold || 5,
          notes: formData.notes || '',
          createdAt: currentItem.createdAt
        };
        await updateItem(itemToUpdate);
        console.log('Ítem actualizado correctamente');
      } else {
        // Add new item
        await createItem(formData);
        console.log('Ítem añadido correctamente');
      }
      
      setIsFormOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Error al guardar el ítem:', error);
      // El error ya se maneja en el hook useInventory
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Agregar Producto
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <InventorySearch
        onSearch={handleSearch}
        onCreateNew={handleCreateNew}
      />
      
      <InventoryTable
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) setCurrentItem(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentItem ? 'Editar' : 'Crear'} Ítem</DialogTitle>
          </DialogHeader>
          <InventoryItemForm
            initialData={currentItem || {
              name: '',
              quantity: 0,
              unit: 'unidad',
              threshold: 5,
              notes: ''
            }}
            isSubmitting={isCreating || isUpdating}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setCurrentItem(null);
            }}
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
