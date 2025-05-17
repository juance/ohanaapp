
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  notes: string;
  created_at?: string;
}

export interface InventorySettings {
  enableLowStockNotifications: boolean;
  defaultThreshold: number;
  autoReorderEnabled: boolean;
}

export interface InventoryMovement {
  id: string;
  item_id: string;
  quantity: number;
  type: 'in' | 'out';
  notes: string;
  created_at: string;
  created_by: string;
}
