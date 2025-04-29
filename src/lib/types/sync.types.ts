
// Sync status types for tracking synchronization state

export interface SyncableTicket {
  id: string;
  ticket_number: string;
  client_name: string;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SyncableCustomerFeedback {
  id: string;
  customer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  customerName?: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
  source?: string;
}

export interface SyncStats {
  lastSync: Date | null;
  pendingCount: number;
  error: string | null;
}

export interface SyncStatus {
  online: boolean;
  syncing: boolean;
  error: string | null;
  lastSyncedAt: Date | null;
  pendingSyncCount: number;
}

export interface SyncStatusResponse {
  online: boolean;
  syncing: boolean;
  error: string | null;
  lastSync: string | null;
  pendingItems: number;
}

export interface SimpleSyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
}
