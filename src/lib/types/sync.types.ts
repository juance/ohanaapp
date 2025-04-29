
export interface SyncStatus {
  online: boolean;
  syncing: boolean;
  error: boolean | string;
  lastSync?: Date | null;
  pending?: number;
}

export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  pendingSync?: boolean;
  synced?: boolean;
}
