
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from '@/lib/types';

// Get all inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      threshold: item.threshold,
      unit: item.unit,
      notes: item.notes,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    
    // Fallback to local storage if database connection fails
    try {
      const localItems = localStorage.getItem('inventoryItems');
      if (localItems) {
        return JSON.parse(localItems);
      }
    } catch (localError) {
      console.error('Error reading from local storage:', localError);
    }
    
    return [];
  }
};

// Add a new inventory item
export const createInventoryItem = async (
  item: Omit<InventoryItem, 'id' | 'created_at'>
): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold,
        unit: item.unit,
        notes: item.notes
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      quantity: data.quantity,
      threshold: data.threshold,
      unit: data.unit,
      notes: data.notes,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return null;
  }
};

export const updateInventoryItem = async (item: InventoryItem): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inventory_items')
      .update({
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold,
        unit: item.unit
      })
      .eq('id', item.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return false;
  }
};

export const deleteInventoryItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return false;
  }
};

// Add a new inventory item (alias to maintain compatibility)
export const addInventoryItem = async (
  name: string, 
  quantity: number, 
  threshold?: number,
  unit?: string,
  notes?: string
): Promise<InventoryItem | null> => {
  return createInventoryItem({
    name,
    quantity,
    threshold,
    unit,
    notes
  });
};
