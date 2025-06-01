
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { InventoryItemFormState } from '@/lib/types/inventory-ui.types';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold?: number;
  unit?: string;
  notes?: string;
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
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');

      if (error) throw error;

      const mappedItems: InventoryItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold || 5,
        unit: item.unit || 'unidad',
        notes: item.notes || '',
        createdAt: item.created_at
      }));

      setItems(mappedItems);
      setFilteredItems(mappedItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al cargar inventario', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: InventoryItemFormState) => {
    try {
      setIsCreating(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{
          name: itemData.name,
          quantity: itemData.quantity,
          threshold: itemData.threshold || 5,
          unit: itemData.unit || 'unidad',
          notes: itemData.notes || ''
        }])
        .select()
        .single();

      if (error) throw error;

      const newItem: InventoryItem = {
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        threshold: data.threshold || 5,
        unit: data.unit || 'unidad',
        notes: data.notes || '',
        createdAt: data.created_at
      };

      setItems(prev => [...prev, newItem]);
      setFilteredItems(prev => [...prev, newItem]);
      toast.success('Producto agregado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al agregar producto', errorMessage);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const updateItem = async (updatedItem: InventoryItem) => {
    try {
      setIsUpdating(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .update({
          name: updatedItem.name,
          quantity: updatedItem.quantity,
          threshold: updatedItem.threshold || 5,
          unit: updatedItem.unit || 'unidad',
          notes: updatedItem.notes || ''
        })
        .eq('id', updatedItem.id)
        .select()
        .single();

      if (error) throw error;

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
      toast.success('Producto actualizado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al actualizar producto', errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      setFilteredItems(prev => prev.filter(item => item.id !== id));
      toast.success('Producto eliminado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al eliminar producto', errorMessage);
      throw err;
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
