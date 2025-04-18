
import { SyncStatus } from '@/lib/types';

// Get the current sync status
export const getSyncStatus = async (): Promise<SyncStatus> => {
  try {
    const currentStatus = localStorage.getItem('syncStatus');

    if (currentStatus) {
      return JSON.parse(currentStatus);
    } else {
      // Return default values if no status is saved
      return {
        ticketsSync: 0,
        expensesSync: 0,
        clientsSync: 0,
        feedbackSync: 0,
        lastSync: null,
        pending: false
      };
    }
  } catch (error) {
    console.error('Error retrieving sync status:', error);
    const defaultStatus: SyncStatus = {
      ticketsSync: 0,
      expensesSync: 0,
      clientsSync: 0,
      feedbackSync: 0,
      lastSync: null,
      pending: false
    };
    return defaultStatus;
  }
};

// Update the sync status
export const updateSyncStatus = async (status: Partial<SyncStatus>): Promise<boolean> => {
  try {
    // Get current status
    const currentStatus = await getSyncStatus();

    // Update with new values
    const updatedStatus: SyncStatus = {
      ...currentStatus,
      ...status,
      lastSync: status.lastSync || new Date().toISOString()
    };

    // Save updated status
    localStorage.setItem('syncStatus', JSON.stringify(updatedStatus));

    return true;
  } catch (error) {
    console.error('Error updating sync status:', error);
    return false;
  }
};

// Set the pending status
export const setPendingSyncStatus = async (pending: boolean): Promise<boolean> => {
  try {
    // Get current status
    const currentStatus = await getSyncStatus();

    // Update with new pending value
    const updatedStatus: SyncStatus = {
      ...currentStatus,
      pending,
      lastSync: new Date().toISOString()
    };

    // Save updated status
    localStorage.setItem('syncStatus', JSON.stringify(updatedStatus));

    return true;
  } catch (error) {
    console.error('Error setting pending sync status:', error);
    return false;
  }
};
