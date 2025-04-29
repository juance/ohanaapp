
import { SimpleSyncStatus } from '@/lib/types/sync.types';

/**
 * Get the current sync status
 * @returns The current sync status
 */
export const getSyncStatus = (): SimpleSyncStatus => {
  try {
    const syncStatusData = localStorage.getItem('syncStatus');
    if (syncStatusData) {
      return JSON.parse(syncStatusData);
    }
    return { tickets: 0, expenses: 0, clients: 0, feedback: 0 };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return { tickets: 0, expenses: 0, clients: 0, feedback: 0 };
  }
};

/**
 * Update the sync status
 * @param status New sync status
 */
export const updateSyncStatus = (status: SimpleSyncStatus): void => {
  try {
    localStorage.setItem('syncStatus', JSON.stringify(status));
  } catch (error) {
    console.error('Error updating sync status:', error);
  }
};

/**
 * Reset the sync status
 */
export const resetSyncStatus = (): void => {
  try {
    localStorage.setItem('syncStatus', JSON.stringify({ tickets: 0, expenses: 0, clients: 0, feedback: 0 }));
  } catch (error) {
    console.error('Error resetting sync status:', error);
  }
};
