
export interface SyncStatus {
  lastSync: string | null;
  syncing: boolean;
  error: string | null;
}

export interface SyncResult {
  success: boolean;
  message: string;
  timestamp: string;
  details?: {
    addedCount?: number;
    updatedCount?: number;
    errorCount?: number;
  };
  tickets?: number;
  expenses?: number;
  clients?: number;
  feedback?: number;
}

export interface SimpleSyncStatus {
  lastSync: string | null;
  syncError?: string | null;
  tickets?: number;
  expenses?: number;
  clients?: number;
  feedback?: number;
}
