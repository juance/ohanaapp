
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItemFormState } from '@/lib/types/inventory-ui.types';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
  notes: string;
  createdAt?: string;
}

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching inventory items...');
      
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
      }

      console.log('Fetched inventory data:', data);

      const mappedItems: InventoryItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold || 5,
        unit: item.unit || 'unidad',
        notes: item.notes || '',
        createdAt: item.created_at
      }));

      console.log('Mapped inventory items:', mappedItems);
      setItems(mappedItems);
      setFilteredItems(mappedItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error in fetchItems:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: InventoryItemFormState) => {
    try {
      setIsCreating(true);
      setError(null);
      console.log('Creating inventory item:', itemData);

      // Validate required fields
      if (!itemData.name || !itemData.name.trim()) {
        throw new Error('El nombre del producto es requerido');
      }

      if (itemData.quantity < 0) {
        throw new Error('La cantidad no puede ser negativa');
      }
      
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{
          name: itemData.name.trim(),
          quantity: itemData.quantity,
          threshold: itemData.threshold || 5,
          unit: itemData.unit || 'unidad',
          notes: itemData.notes || ''
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating inventory item:', error);
        throw new Error(`Error al crear el producto: ${error.message}`);
      }

      console.log('Successfully created inventory item:', data);

      const newItem: InventoryItem = {
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        threshold: data.threshold || 5,
        unit: data.unit || 'unidad',
        notes: data.notes || '',
        createdAt: data.created_at
      };

      setItems(prev => [newItem, ...prev]);
      setFilteredItems(prev => [newItem, ...prev]);
      console.log('Producto agregado correctamente al inventario');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el producto';
      console.error('Error in createItem:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const updateItem = async (updatedItem: InventoryItem) => {
    try {
      setIsUpdating(true);
      setError(null);
      console.log('Updating inventory item:', updatedItem);

      // Validate required fields
      if (!updatedItem.name || !updatedItem.name.trim()) {
        throw new Error('El nombre del producto es requerido');
      }

      if (updatedItem.quantity < 0) {
        throw new Error('La cantidad no puede ser negativa');
      }
      
      const { data, error } = await supabase
        .from('inventory_items')
        .update({
          name: updatedItem.name.trim(),
          quantity: updatedItem.quantity,
          threshold: updatedItem.threshold || 5,
          unit: updatedItem.unit || 'unidad',
          notes: updatedItem.notes || ''
        })
        .eq('id', updatedItem.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating inventory item:', error);
        throw new Error(`Error al actualizar el producto: ${error.message}`);
      }

      console.log('Successfully updated inventory item:', data);

      const updated: InventoryItem = {
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        threshold: data.threshold || 5,
        unit: data.unit || 'unidad',
        notes: data.notes || '',
        createdAt: data.created_at
      };

      setItems(prev => prev.map(item => 
        item.id === updatedItem.id ? updated : item
      ));
      setFilteredItems(prev => prev.map(item => 
        item.id === updatedItem.id ? updated : item
      ));
      console.log('Producto actualizado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el producto';
      console.error('Error in updateItem:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      console.log('Deleting inventory item:', id);
      
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting inventory item:', error);
        throw new Error(`Error al eliminar el producto: ${error.message}`);
      }

      setItems(prev => prev.filter(item => item.id !== id));
      setFilteredItems(prev => prev.filter(item => item.id !== id));
      console.log('Producto eliminado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el producto';
      console.error('Error in deleteItem:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items: filteredItems,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    searchQuery,
    setSearchQuery,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
};
