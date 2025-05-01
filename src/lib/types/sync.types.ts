
// Types for sync operations

export interface SyncableCustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync: boolean;
  pendingDelete?: boolean;
}

export interface SimpleSyncStatus {
  tickets: number;
  clients: number;
  feedback: number;
  expenses: number;
  lastSync: Date | null;
}
