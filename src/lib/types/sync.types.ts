
export interface SyncStats {
  added: number;
  updated: number;
  failed: number;
}

export interface SyncResult {
  tickets: SyncStats;
  clients: SyncStats;
  inventory: SyncStats;
  feedback: SyncStats;
  expenses: SyncStats;
  timestamp?: Date;
  success?: boolean;
  error?: string;
}

export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  valets_count: number;
  free_valets: number;
  loyalty_points: number;
}

export interface SyncableCustomerFeedback {
  id?: string;
  customer_id?: string;
  customer_name: string;
  rating: number;
  comment: string;
  source?: string;
  created_at?: string;
}

export interface SimpleSyncStatus {
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  tickets?: number;
  clients?: number;
  expenses?: number;
  feedback?: number;
  lastSync: string;
  syncError: string | null;
}

export interface SyncableExpense {
  id?: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at?: string;
  pendingSync?: boolean;
  synced?: boolean;
}
