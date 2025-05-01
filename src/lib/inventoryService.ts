import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from '@/lib/types';

// Get all inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory')
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
      createdAt: item.created_at
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
export const addInventoryItem = async (
  name: string, 
  quantity: number, 
  threshold?: number,
  unit?: string,
  notes?: string
): Promise<InventoryItem | null> => {
  try {
    const newItem = {
      id: uuidv4(), // Generate a UUID for the new item
      name,
      quantity,
      threshold,
      unit,
      notes
    };
    
    // Try to insert into database first
    const { data, error } = await supabase
      .from('inventory')
      .insert({
        name: newItem.name,
        quantity: newItem.quantity,
        threshold: newItem.threshold,
        unit: newItem.unit,
        notes: newItem.notes
      })
      .select();
    
    if (error) throw error;
    
    if (data && data[0]) {
      return {
        id: data[0].id,
        name: data[0].name,
        quantity: data[0].quantity,
        threshold: data[0].threshold,
        unit: data[0].unit,
        notes: data[0].notes,
        createdAt: data[0].created_at,
        lastUpdated: new Date().toISOString()
      };
    }
    
    // If database insert failed, add to local storage
    try {
      const items = await getInventoryItems();
      const updatedItems = [...items, newItem];
      localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
      return newItem;
    } catch (localError) {
      console.error('Error storing in local storage:', localError);
      return null;
    }
  } catch (error) {
    console.error('Error adding inventory item:', error);
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

export const createInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold,
        unit: item.unit
      })
      .select('*')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      quantity: data.quantity,
      threshold: data.threshold,
      unit: data.unit,
      lastUpdated: data.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return null;
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

// Añadimos esta función para hacerlo compatible con el componente InventoryList
export const addInventoryItem = createInventoryItem;
