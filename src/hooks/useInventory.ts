
import { useState, useEffect, useCallback } from 'react';
import { InventoryItemWithTimestamp, InventoryItemFormState } from '@/lib/types/inventory-ui.types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItemWithTimestamp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load inventory items
  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        const formattedItems: InventoryItemWithTimestamp[] = data.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit || '',
          threshold: item.threshold || 0,
          notes: item.notes || '',
          created_at: item.created_at,
          updated_at: item.updated_at,
          lastUpdated: item.updated_at || item.created_at
        }));
        setItems(formattedItems);
      }
    } catch (error) {
      console.error('Error loading inventory items:', error);
      toast.error('Error al cargar el inventario');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    loadItems();
  }, [loadItems]);
  
  // Create a new inventory item
  const createItem = async (item: InventoryItemFormState): Promise<void> => {
    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          threshold: item.threshold,
          notes: item.notes
        });
        
      if (error) throw error;
      
      await loadItems();
      toast.success('Ítem creado correctamente');
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };
  
  // Update an existing inventory item
  const updateItem = async (item: InventoryItemWithTimestamp): Promise<void> => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          threshold: item.threshold,
          notes: item.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);
        
      if (error) throw error;
      
      await loadItems();
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Delete an inventory item
  const deleteItem = async (id: string): Promise<void> => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      await loadItems();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Filter items based on search query
  const filteredItems = items.filter(item =>
    searchQuery === '' || 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return {
    items: filteredItems,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    searchQuery,
    setSearchQuery,
    createItem,
    updateItem,
    deleteItem,
    refreshItems: loadItems
  };
};

export default useInventory;
