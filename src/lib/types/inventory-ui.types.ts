
import { InventoryItem } from './inventory.types';

export type SortDirection = 'asc' | 'desc';

export interface InventorySortState {
  field: keyof InventoryItem;
  direction: SortDirection;
}

export interface InventoryFilterState {
  search: string;
  lowStock: boolean;
}

// Add missing types
export interface InventoryItemWithTimestamp extends InventoryItem {
  lastUpdated?: string;
}

export interface InventoryItemFormState {
  name: string;
  quantity: number;
  unit?: string;
  threshold?: number;
  notes?: string;
}

export interface InventoryItemProps {
  item: InventoryItemWithTimestamp;
  onEdit: (item: InventoryItemWithTimestamp) => void;
  onDelete: (item: InventoryItemWithTimestamp) => void;
}
