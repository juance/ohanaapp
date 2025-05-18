
/**
 * Basic sync status information
 */
export interface SimpleSyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  lastSync: string | null;
}

/**
 * Result of a sync operation
 */
export interface SyncResult {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

/**
 * Comprehensive sync options
 */
export interface SyncOptions {
  force?: boolean;
  types?: ('tickets' | 'expenses' | 'clients' | 'feedback')[];
  onProgress?: (progress: number) => void;
}
