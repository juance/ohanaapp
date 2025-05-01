
// Inventory types

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold?: number;
  unit?: string;
  notes?: string;
  createdAt?: string;
  lastUpdated?: string;
}
