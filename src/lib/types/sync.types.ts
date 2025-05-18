
export interface SyncStatus {
  lastSync: string;
  syncInProgress: boolean;
  error: string | null;
}

export interface SimpleSyncStatus {
  timestamp: string;
  status: 'success' | 'error' | 'in-progress';
  message?: string;
  lastSync?: string;
  syncError?: string | null;
  tickets?: number;
  expenses?: number;
  clients?: number;
  feedback?: number;
}

export interface SyncResult {
  status: 'success' | 'error' | 'partial';
  message: string;
  timestamp: string;
  tickets: {
    added: number;
    updated: number;
    failed: number;
  };
  expenses: {
    added: number;
    updated: number;
    failed: number;
  };
  clients: {
    added: number;
    updated: number;
    failed: number;
  };
  feedback: {
    added: number;
    updated: number;
    failed: number;
  };
}
