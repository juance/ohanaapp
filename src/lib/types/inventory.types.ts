
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  notes?: string;
  createdAt?: string;
}

export interface InventoryUpdate {
  name?: string;
  quantity?: number;
  unit?: string;
  threshold?: number;
  notes?: string;
}
