
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InventoryItem } from './types';

// Get all inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      threshold: item.threshold,
      unit: item.unit,
      lastUpdated: new Date(item.updated_at).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    toast.error('Error fetching inventory items');
    return [];
  }
};

// Add new inventory item
export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem | null> => {
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
      lastUpdated: new Date(data.updated_at).toLocaleDateString()
    };
  } catch (error) {
    console.error('Error adding inventory item:', error);
    toast.error('Error adding inventory item');
    return null;
  }
};

// Update inventory item
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
    toast.error('Error updating inventory item');
    return false;
  }
};

// Delete inventory item
export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    toast.error('Error deleting inventory item');
    return false;
  }
};
