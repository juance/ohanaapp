
import React, { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { InventoryItemWithTimestamp } from '@/lib/types/inventory-ui.types';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItemWithTimestamp[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof InventoryItemWithTimestamp | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Mock data for demonstration
    const mockInventory: InventoryItemWithTimestamp[] = [
      { id: '1', name: 'Camisetas', quantity: 50, unit: 'unidades', threshold: 20, notes: 'Algodón', lastUpdated: '2024-07-01' },
      { id: '2', name: 'Pantalones', quantity: 30, unit: 'unidades', threshold: 15, notes: 'Jean', lastUpdated: '2024-07-01' },
      { id: '3', name: 'Zapatos', quantity: 20, unit: 'pares', threshold: 10, notes: 'Cuero', lastUpdated: '2024-07-01' },
    ];
    setItems(mockInventory);
  }, []);

  const handleSort = (column: keyof InventoryItemWithTimestamp) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedItems = React.useMemo(() => {
    if (!sortColumn) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortColumn] || '';
      const bValue = b[sortColumn] || '';

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [items, sortColumn, sortDirection]);

  const createItem = async (newItem: Omit<InventoryItemWithTimestamp, 'id'>) => {
    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newItemWithId: InventoryItemWithTimestamp = { 
        ...newItem, 
        id: String(Date.now()), 
        lastUpdated: new Date().toISOString() 
      };
      setItems([...items, newItemWithId]);
      toast.success('Ítem creado con éxito');
      return true;
    } catch (error) {
      toast.error('Error al crear el ítem');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const updateItem = async (editItem: InventoryItemWithTimestamp) => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedItems = items.map(item => 
        item.id === editItem.id 
          ? { ...editItem, lastUpdated: new Date().toISOString() } 
          : item
      );
      setItems(updatedItems);
      toast.success('Ítem actualizado con éxito');
      return true;
    } catch (error) {
      toast.error('Error al actualizar el ítem');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      toast.success('Ítem eliminado con éxito');
      return true;
    } catch (error) {
      toast.error('Error al eliminar el ítem');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    items: sortedItems,
    isCreating,
    isUpdating,
    isDeleting,
    sortColumn,
    sortDirection,
    handleSort,
    createItem,
    updateItem,
    deleteItem,
  };
};

export default useInventory;
