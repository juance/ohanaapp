
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { SYNC_STATUS_KEY } from '@/lib/constants/storageKeys';

// Define SyncStatus type
export interface SyncStatus {
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
  lastSync: Date | string | null;
  pending: boolean;
}

// Get current sync status
export const getSyncStatus = (): SyncStatus => {
  const status = getFromLocalStorage<SyncStatus>(SYNC_STATUS_KEY);
  
  if (!status) {
    // Initialize with default values if not found
    const defaultStatus: SyncStatus = {
      ticketsSync: 0,
      expensesSync: 0,
      clientsSync: 0,
      feedbackSync: 0,
      lastSync: null,
      pending: false
    };
    
    saveToLocalStorage(SYNC_STATUS_KEY, defaultStatus);
    return defaultStatus;
  }
  
  return status;
};

// Update sync status
export const updateSyncStatus = (status: Partial<SyncStatus>): void => {
  const currentStatus = getSyncStatus();
  const updatedStatus = { ...currentStatus, ...status };
  saveToLocalStorage(SYNC_STATUS_KEY, updatedStatus);
};

// Set sync as pending
export const setSyncPending = (pending: boolean = true): void => {
  updateSyncStatus({ pending });
};

// Increment sync count
export const incrementSyncCount = (type: keyof Pick<SyncStatus, 'ticketsSync' | 'expensesSync' | 'clientsSync' | 'feedbackSync'>, count: number): void => {
  const currentStatus = getSyncStatus();
  const updatedStatus = { 
    ...currentStatus,
    [type]: currentStatus[type] + count,
    lastSync: new Date().toISOString()
  };
  saveToLocalStorage(SYNC_STATUS_KEY, updatedStatus);
};

// Reset sync status
export const resetSyncStatus = (): void => {
  const defaultStatus: SyncStatus = {
    ticketsSync: 0,
    expensesSync: 0,
    clientsSync: 0,
    feedbackSync: 0,
    lastSync: null,
    pending: false
  };
  
  saveToLocalStorage(SYNC_STATUS_KEY, defaultStatus);
};
