
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold?: number;
  notes?: string;
  createdAt: string;
  lastUpdated?: string; // Add the missing field
}
