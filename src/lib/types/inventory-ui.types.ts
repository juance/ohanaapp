
import { InventoryItem } from '@/lib/types/inventory.types';

// Extended inventory item with UI-specific properties
export interface InventoryItemWithTimestamp extends InventoryItem {
  lastUpdated?: string;
  updated_at?: string; // Make updated_at optional since it might not exist in the database
}

// Props for the InventoryItem component
export interface InventoryItemProps {
  item: InventoryItemWithTimestamp;
  onEdit: (item: InventoryItemWithTimestamp) => void;
  onDelete: (item: InventoryItemWithTimestamp) => void;
}

// Props for the inventory list component
export interface InventoryListProps {
  searchQuery?: string;
}

// Form state for creating/editing items
export interface InventoryItemFormState {
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  notes: string;
}
