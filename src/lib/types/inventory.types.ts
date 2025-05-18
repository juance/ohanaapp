
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold?: number;
  unit?: string;
  notes?: string;
}
