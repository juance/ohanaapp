
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold?: number;
  notes?: string;
  createdAt: string;
  lastUpdated?: string;
}

// Adding this type to handle items with lastUpdated properly
export interface InventoryItemWithTimestamp extends InventoryItem {
  lastUpdated: string;
}
