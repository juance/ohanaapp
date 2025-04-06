
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from './types';
import { toast } from '@/lib/toast';

export async function getInventoryItems(): Promise<InventoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Error al obtener inventario: ${error.message}`);
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity || 0,
      unit: item.unit || 'unidad',
      threshold: item.threshold || 5,
      lastUpdated: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '',
      notes: item.notes || ''
    }));
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    toast.error('Error al cargar el inventario');
    return [];
  }
}

export async function getInventoryItem(id: string): Promise<InventoryItem | null> {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error al obtener item: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      quantity: data.quantity || 0,
      unit: data.unit || 'unidad',
      threshold: data.threshold || 5,
      lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleDateString() : '',
      notes: data.notes || ''
    };
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    toast.error('Error al cargar el item de inventario');
    return null;
  }
}

export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem | null> => {
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
      .select('*')
      .single();

    if (error) throw error;

    toast({
      title: "Success",
      description: 'Elemento de inventario agregado con éxito'
    });

    return {
      id: data.id,
      name: data.name,
      quantity: data.quantity,
      threshold: data.threshold,
      unit: data.unit,
      lastUpdated: data.created_at ? new Date(data.created_at).toLocaleDateString() : '',
      notes: data.notes || ''
    };
  } catch (error) {
    console.error('Error al agregar elemento de inventario:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: 'Error al agregar elemento de inventario'
    });
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
        unit: item.unit,
        notes: item.notes
      })
      .eq('id', item.id);

    if (error) throw error;

    toast({
      title: "Success",
      description: 'Elemento de inventario actualizado con éxito'
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar elemento de inventario:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: 'Error al actualizar elemento de inventario'
    });
    return false;
  }
};

export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Success",
      description: 'Elemento de inventario eliminado con éxito'
    });
    return true;
  } catch (error) {
    console.error('Error al eliminar elemento de inventario:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: 'Error al eliminar elemento de inventario'
    });
    return false;
  }
};
