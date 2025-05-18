
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
