
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useInventory from '@/hooks/useInventory';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryItemForm from '@/components/inventory/InventoryItemForm';
import DeleteItemDialog from '@/components/inventory/DeleteItemDialog';
import InventorySearch from '@/components/inventory/InventorySearch';
import { InventoryItemWithTimestamp, InventoryItemFormState } from '@/lib/types/inventory-ui.types';

const InventoryList = () => {
  // Inventory state and operations
  const {
    items,
    isCreating,
    isUpdating,
    isDeleting,
    sortColumn,
    sortDirection,
    handleSort,
    createItem,
    updateItem,
    deleteItem,
  } = useInventory();

  // Local UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItemWithTimestamp | null>(null);

  // Form states
  const [newItem, setNewItem] = useState<InventoryItemFormState>({
    name: '',
    quantity: 0,
    unit: '',
    threshold: 0,
    notes: ''
  });
  
  const [editItem, setEditItem] = useState<InventoryItemWithTimestamp>({
    id: '',
    name: '',
    quantity: 0,
    unit: '',
    threshold: 0,
    notes: ''
  });

  // Filter items by search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Event handlers
  const handleCreateItem = async () => {
    const success = await createItem(newItem);
    if (success) {
      setNewItem({ name: '', quantity: 0, unit: '', threshold: 0, notes: '' });
      setOpenCreateDialog(false);
    }
  };

  const handleUpdateItem = async () => {
    const success = await updateItem(editItem);
    if (success) {
      setOpenEditDialog(false);
    }
  };

  const handleDeleteItem = async () => {
    if (selectedItem) {
      const success = await deleteItem(selectedItem.id);
      if (success) {
        setOpenDeleteDialog(false);
        setSelectedItem(null);
      }
    }
  };

  const handleEditClick = (item: InventoryItemWithTimestamp) => {
    setEditItem(item);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (item: InventoryItemWithTimestamp) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Inventario</CardTitle>
        <InventorySearch 
          onSearch={setSearchQuery} 
          onCreateNew={() => setOpenCreateDialog(true)}
        />
      </CardHeader>
      <CardContent>
        <InventoryTable
          items={filteredItems}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </CardContent>

      {/* Create Item Dialog */}
      <InventoryItemForm
        isOpen={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        title="Crear Ítem"
        formState={newItem}
        setFormState={setNewItem}
        onSubmit={handleCreateItem}
        isSubmitting={isCreating}
        submitLabel="Crear"
      />

      {/* Edit Item Dialog */}
      <InventoryItemForm
        isOpen={openEditDialog}
        onOpenChange={setOpenEditDialog}
        title="Editar Ítem"
        formState={editItem}
        setFormState={setEditItem}
        onSubmit={handleUpdateItem}
        isSubmitting={isUpdating}
        submitLabel="Actualizar"
      />

      {/* Delete Item Dialog */}
      <DeleteItemDialog
        isOpen={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onDelete={handleDeleteItem}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default InventoryList;
