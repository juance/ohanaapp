
import React, { useState, useEffect } from 'react';
import { InventoryItemWithTimestamp, InventoryItemFormState } from '@/lib/types/inventory-ui.types';
import InventorySearch from '@/components/inventory/InventorySearch';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryItemForm from '@/components/inventory/InventoryItemForm';
import DeleteItemDialog from '@/components/inventory/DeleteItemDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Mock inventory data for testing
const mockInventoryData: InventoryItemWithTimestamp[] = [
  {
    id: '1',
    name: 'Detergente líquido',
    quantity: 15,
    unit: 'litros',
    threshold: 5,
    notes: 'Para lavadora',
    lastUpdated: '2023-06-01'
  },
  {
    id: '2',
    name: 'Perchas',
    quantity: 200,
    unit: 'unidades',
    threshold: 50,
    notes: 'Plásticas',
    lastUpdated: '2023-05-28'
  },
  {
    id: '3',
    name: 'Bolsas',
    quantity: 500,
    unit: 'unidades',
    threshold: 100,
    notes: 'Para entrega',
    lastUpdated: '2023-06-02'
  },
];

const InventoryList: React.FC = () => {
  const [items, setItems] = useState<InventoryItemWithTimestamp[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItemWithTimestamp[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<InventoryItemFormState>({
    name: '',
    quantity: 0,
    unit: '',
    threshold: 0,
    notes: ''
  });
  const [itemToDelete, setItemToDelete] = useState<InventoryItemWithTimestamp | null>(null);

  useEffect(() => {
    // In a real app, fetch from API or localStorage
    setItems(mockInventoryData);
    setFilteredItems(mockInventoryData);
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.notes.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleCreateNew = () => {
    setCurrentItem({
      name: '',
      quantity: 0,
      unit: '',
      threshold: 0,
      notes: ''
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: InventoryItemWithTimestamp) => {
    // Convert to form state, ensuring all required properties are present
    setCurrentItem({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit || '', // Ensure unit is not undefined
      threshold: item.threshold || 0, // Ensure threshold is not undefined
      notes: item.notes || '' // Ensure notes is not undefined
    });
    setIsFormOpen(true);
  };

  const handleDelete = (item: InventoryItemWithTimestamp) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      // In a real app, call API to delete
      const updatedItems = items.filter((item) => item.id !== itemToDelete.id);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      toast.success('Ítem eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el ítem');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (formData: InventoryItemFormState) => {
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString().split('T')[0];
      
      if (currentItem.name && items.some(item => item.name === currentItem.name)) {
        // Update existing item
        const updatedItems = items.map((item) =>
          item.name === currentItem.name
            ? { ...item, ...formData, lastUpdated: now }
            : item
        );
        setItems(updatedItems);
        setFilteredItems(updatedItems);
        toast.success('Ítem actualizado correctamente');
      } else {
        // Add new item
        const newItem: InventoryItemWithTimestamp = {
          id: uuidv4(),
          ...formData,
          lastUpdated: now
        };
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        setFilteredItems(updatedItems);
        toast.success('Ítem añadido correctamente');
      }
      
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Error al guardar el ítem');
    } finally {
      setIsSubmitting(false);
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
            <DialogTitle>{currentItem.name ? 'Editar' : 'Crear'} Ítem</DialogTitle>
          </DialogHeader>
          <InventoryItemForm
            initialData={currentItem}
            isSubmitting={isSubmitting}
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
