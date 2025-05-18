
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold?: number;
  unit?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type InventoryAction = 'increase' | 'decrease' | 'set';

export interface InventoryUpdate {
  id: string;
  action: InventoryAction;
  amount: number;
  reason?: string;
}

export interface InventoryAlert {
  itemId: string;
  itemName: string;
  currentQuantity: number;
  threshold: number;
  severity: 'low' | 'critical';
}
