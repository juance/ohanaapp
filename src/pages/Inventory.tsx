
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import InventoryList from '@/components/InventoryList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InventoryItemForm from '@/components/inventory/InventoryItemForm';
import { useInventory } from '@/hooks/useInventory';
import { toast } from '@/lib/toast';
import { InventoryItemFormState } from '@/lib/types/inventory-ui.types';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { createItem, isCreating } = useInventory();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateNew = () => {
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: InventoryItemFormState) => {
    try {
      await createItem(formData);
      toast.success('Producto agregado correctamente');
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating inventory item:", error);
      toast.error('Error al agregar el producto');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventario</h1>
        
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos en Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-8" 
                placeholder="Buscar productos..." 
                value={searchQuery} 
                onChange={handleSearch} 
              />
            </div>
          </div>
          
          <InventoryList />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Producto</DialogTitle>
          </DialogHeader>
          <InventoryItemForm
            initialData={{
              name: '',
              quantity: 0,
              unit: 'unidad',
              threshold: 5,
              notes: ''
            }}
            isSubmitting={isCreating}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
