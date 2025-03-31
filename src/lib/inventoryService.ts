
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { InventoryItem } from './types';

// Obtener todos los elementos del inventario
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
    console.error('Error al obtener elementos del inventario:', error);
    toast.error("Failed to get inventory items");
    return [];
  }
};

// Agregar nuevo elemento al inventario
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
    
    toast.success("Inventory item added successfully");
    
    return {
      id: data.id,
      name: data.name,
      quantity: data.quantity,
      threshold: data.threshold,
      unit: data.unit,
      lastUpdated: new Date(data.updated_at).toLocaleDateString()
    };
  } catch (error) {
    console.error('Error al agregar elemento de inventario:', error);
    toast.error("Failed to add inventory item");
    return null;
  }
};

// Actualizar elemento del inventario
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
    
    toast.success("Inventory item updated successfully");
    return true;
  } catch (error) {
    console.error('Error al actualizar elemento de inventario:', error);
    toast.error("Failed to update inventory item");
    return false;
  }
};

// Eliminar elemento del inventario
export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success("Inventory item deleted successfully");
    return true;
  } catch (error) {
    console.error('Error al eliminar elemento de inventario:', error);
    toast.error("Failed to delete inventory item");
    return false;
  }
};
