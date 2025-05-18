
export interface SyncResult {
  tickets?: number;
  expenses?: number;
  clients?: number;
  feedback?: number;
  success: boolean;
  error?: string;
}

export interface SimpleSyncStatus {
  lastSync: string | null;
  syncError: string | null;
  tickets?: number;
  expenses?: number;
  clients?: number;
  feedback?: number;
}

export interface SyncableItem {
  id: string;
  pendingSync?: boolean;
}

export interface SyncableExpense {
  id: string;
  amount: number;
  date: string;
  description: string;
  category?: string;
  pendingSync?: boolean;
  created_at?: string;
}

export interface SyncableClient {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  pendingSync?: boolean;
}

export interface SyncableFeedback {
  id: string;
  customerId?: string;
  customerName: string;
  rating: number;
  comment: string;
  pendingSync?: boolean;
}
