
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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
    toast({
      title: "Error",
      description: "Error fetching inventory items",
      variant: "destructive"
    });
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
    
    toast({
      title: "Success",
      description: "Inventory item added successfully"
    });
    
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
    toast({
      title: "Error",
      description: "Error adding inventory item",
      variant: "destructive"
    });
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
    
    toast({
      title: "Success",
      description: "Inventory item updated successfully"
    });
    return true;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    toast({
      title: "Error",
      description: "Error updating inventory item",
      variant: "destructive"
    });
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
    
    toast({
      title: "Success",
      description: "Inventory item deleted successfully"
    });
    return true;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    toast({
      title: "Error",
      description: "Error deleting inventory item",
      variant: "destructive"
    });
    return false;
  }
};
