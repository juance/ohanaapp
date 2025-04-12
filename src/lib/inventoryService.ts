
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { InventoryItem } from './types';

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // First try to get items from Supabase
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }
    
    // Transform to our internal format
    return data.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      threshold: item.threshold,
      unit: item.unit,
      lastUpdated: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching inventory from Supabase:', error);
    
    // Fallback to local storage
    const localInventory = localStorage.getItem('inventory');
    if (localInventory) {
      try {
        return JSON.parse(localInventory);
      } catch (parseError) {
        console.error('Error parsing local inventory:', parseError);
      }
    }
    
    return [];
  }
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem | null> => {
  try {
    const newItem: InventoryItem = {
      id: uuidv4(),
      ...item,
      lastUpdated: new Date().toISOString()
    };
    
    // Try to add to Supabase
    const { data, error } = await supabase
      .from('inventory')
      .insert({
        name: newItem.name,
        quantity: newItem.quantity,
        threshold: newItem.threshold,
        unit: newItem.unit
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // If successful, use the Supabase ID
    newItem.id = data.id;
    
    // Save to local storage as well
    const localItems = localStorage.getItem('inventory');
    const items: InventoryItem[] = localItems ? JSON.parse(localItems) : [];
    items.push(newItem);
    localStorage.setItem('inventory', JSON.stringify(items));
    
    return newItem;
  } catch (error) {
    console.error('Error adding inventory item:', error);
    
    // If Supabase fails, save locally
    try {
      const newItem: InventoryItem = {
        id: uuidv4(),
        ...item,
        lastUpdated: new Date().toISOString(),
        pendingSync: true
      };
      
      const localItems = localStorage.getItem('inventory');
      const items: InventoryItem[] = localItems ? JSON.parse(localItems) : [];
      items.push(newItem);
      localStorage.setItem('inventory', JSON.stringify(items));
      
      return newItem;
    } catch (localError) {
      console.error('Error saving inventory item locally:', localError);
      return null;
    }
  }
};

export const updateInventoryItem = async (item: InventoryItem): Promise<boolean> => {
  try {
    // Update the lastUpdated timestamp
    const updatedItem = {
      ...item,
      lastUpdated: new Date().toISOString()
    };
    
    // Try to update in Supabase
    const { error } = await supabase
      .from('inventory')
      .update({
        name: updatedItem.name,
        quantity: updatedItem.quantity,
        threshold: updatedItem.threshold,
        unit: updatedItem.unit,
        updated_at: updatedItem.lastUpdated
      })
      .eq('id', updatedItem.id);
    
    if (error) {
      throw error;
    }
    
    // Update in local storage
    const localItems = localStorage.getItem('inventory');
    if (localItems) {
      const items: InventoryItem[] = JSON.parse(localItems);
      const updatedItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
      localStorage.setItem('inventory', JSON.stringify(updatedItems));
    }
    
    return true;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    
    // If Supabase fails, update locally
    try {
      const updatedItem = {
        ...item,
        lastUpdated: new Date().toISOString(),
        pendingSync: true
      };
      
      const localItems = localStorage.getItem('inventory');
      if (localItems) {
        const items: InventoryItem[] = JSON.parse(localItems);
        const updatedItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
        localStorage.setItem('inventory', JSON.stringify(updatedItems));
      }
      
      return true;
    } catch (localError) {
      console.error('Error updating inventory item locally:', localError);
      return false;
    }
  }
};

export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    // Try to delete from Supabase
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    // Delete from local storage
    const localItems = localStorage.getItem('inventory');
    if (localItems) {
      const items: InventoryItem[] = JSON.parse(localItems);
      const filteredItems = items.filter(item => item.id !== id);
      localStorage.setItem('inventory', JSON.stringify(filteredItems));
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    
    // Try to at least remove from local storage
    try {
      const localItems = localStorage.getItem('inventory');
      if (localItems) {
        const items: InventoryItem[] = JSON.parse(localItems);
        const filteredItems = items.filter(item => item.id !== id);
        localStorage.setItem('inventory', JSON.stringify(filteredItems));
      }
      
      return true;
    } catch (localError) {
      console.error('Error deleting inventory item locally:', localError);
      return false;
    }
  }
};
