
/**
 * Simple sync status service to track synchronization status
 */

import { SyncStatus } from '@/lib/types';

// Get sync status
export const getSyncStatus = (): SyncStatus => {
  try {
    // Initialize status with default values
    const status: SyncStatus = {
      online: navigator.onLine,
      syncing: false,
      error: null,
      lastSyncedAt: null,
      pendingSyncCount: 0 
    };
    
    return status;
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      online: navigator.onLine,
      syncing: false,
      error: String(error),
      lastSyncedAt: null,
      pendingSyncCount: 0
    };
  }
};

// Update sync status
export const updateSyncStatus = async (syncData: {
  ticketsSync?: number;
  clientsSync?: number;
  feedbackSync?: number;
  expensesSync?: number;
  lastSync?: string;
}): Promise<boolean> => {
  try {
    // In a real application, this would update a database or localStorage
    console.log('Updating sync status with:', syncData);
    return true;
  } catch (error) {
    console.error('Error updating sync status:', error);
    return false;
  }
};

// Get a simplified sync status for components to use
export const getSimplifiedSyncStatus = () => {
  return {
    tickets: 0,
    expenses: 0,
    clients: 0,
    feedback: 0
  };
};
