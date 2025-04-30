
export interface SimpleSyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  lastSync: string;
}

export interface SyncMetrics {
  totalSynced: number;
  lastSyncTime: string;
  byEntityType: {
    tickets: number;
    clients: number;
    expenses: number;
    feedback: number;
  };
}

export interface SyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  pending?: boolean;
  lastSync?: string;
  pendingSyncCount?: number;
  lastSyncedAt?: Date;
}
