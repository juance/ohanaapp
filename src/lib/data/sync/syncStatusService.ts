
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { SYNC_STATUS_KEY } from '@/lib/constants/storageKeys';
import { SyncStatus } from '@/lib/types/sync.types';

// Get the current sync status
export const getSyncStatus = (): SyncStatus => {
  const status = getFromLocalStorage<SyncStatus>(SYNC_STATUS_KEY);
  
  if (!status) {
    return {
      ticketsSync: 0,
      expensesSync: 0,
      clientsSync: 0,
      feedbackSync: 0,
      lastSync: null,
      pending: false
    };
  }
  
  return status;
};

// Update the sync status
export const updateSyncStatus = (status: SyncStatus): void => {
  // Add last sync timestamp
  const updatedStatus: SyncStatus = {
    ...status,
    lastSync: new Date().toISOString()
  };
  
  saveToLocalStorage(SYNC_STATUS_KEY, updatedStatus);
};

// Reset the sync status
export const resetSyncStatus = (): void => {
  const emptyStatus: SyncStatus = {
    ticketsSync: 0,
    expensesSync: 0,
    clientsSync: 0,
    feedbackSync: 0,
    lastSync: null,
    pending: false
  };
  
  saveToLocalStorage(SYNC_STATUS_KEY, emptyStatus);
};
