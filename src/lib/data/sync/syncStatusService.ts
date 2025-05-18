
import { SimpleSyncStatus } from '@/lib/types/sync.types';

// Default empty sync status
const DEFAULT_SYNC_STATUS: SimpleSyncStatus = {
  tickets: 0,
  expenses: 0,
  clients: 0,
  feedback: 0,
  lastSync: null
};

/**
 * Get the current sync status from local storage
 */
export const getSyncStatus = (): SimpleSyncStatus => {
  try {
    const storedStatus = localStorage.getItem('sync_status');
    return storedStatus ? JSON.parse(storedStatus) : DEFAULT_SYNC_STATUS;
  } catch (e) {
    console.error('Error reading sync status:', e);
    return DEFAULT_SYNC_STATUS;
  }
};

/**
 * Update the sync status in local storage
 */
export const updateSyncStatus = (status: Partial<SimpleSyncStatus>): SimpleSyncStatus => {
  try {
    const currentStatus = getSyncStatus();
    const newStatus = { ...currentStatus, ...status };
    localStorage.setItem('sync_status', JSON.stringify(newStatus));
    return newStatus;
  } catch (e) {
    console.error('Error updating sync status:', e);
    return getSyncStatus();
  }
};

/**
 * Clear pending sync items for a specific type
 */
export const clearPendingSyncItems = (type: keyof Omit<SimpleSyncStatus, 'lastSync'>, count: number): SimpleSyncStatus => {
  const currentStatus = getSyncStatus();
  const currentCount = currentStatus[type] || 0;
  
  return updateSyncStatus({
    [type]: Math.max(0, currentCount - count),
    lastSync: new Date().toISOString()
  });
};

/**
 * Add pending sync items for a specific type
 */
export const addPendingSyncItems = (type: keyof Omit<SimpleSyncStatus, 'lastSync'>, count: number): SimpleSyncStatus => {
  const currentStatus = getSyncStatus();
  const currentCount = currentStatus[type] || 0;
  
  return updateSyncStatus({
    [type]: currentCount + count
  });
};
