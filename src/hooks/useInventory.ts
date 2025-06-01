
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryItemFormState {
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
  notes: string;
}

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al cargar inventario', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemData: InventoryItemFormState) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{
          name: itemData.name,
          quantity: itemData.quantity,
          threshold: itemData.threshold,
          unit: itemData.unit,
          notes: itemData.notes
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
      toast.success('Producto agregado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al agregar producto', errorMessage);
      throw err;
    }
  };

  const updateItem = async (id: string, itemData: Partial<InventoryItemFormState>) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedItem: InventoryItem = {
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        threshold: data.threshold || 5,
        unit: data.unit || 'unidad',
        notes: data.notes || '',
        createdAt: data.created_at
      };

      setItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
      toast.success('Producto actualizado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al actualizar producto', errorMessage);
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Producto eliminado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al eliminar producto', errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };
};
