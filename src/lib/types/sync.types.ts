
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
}
