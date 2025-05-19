
import { SimpleSyncStatus } from '@/lib/types/sync.types';

// Get the current sync status from localStorage
export const getSyncStatus = (): SimpleSyncStatus => {
  try {
    const syncStatusStr = localStorage.getItem('syncStatus');
    if (syncStatusStr) {
      return JSON.parse(syncStatusStr);
    }
    
    // Default sync status if none exists
    return {
      timestamp: new Date().toISOString(),
      status: 'success',
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0,
      inventory: 0,
      lastSync: null,
      syncError: null // Añadido syncError para satisfacer la interfaz
    };
  } catch (error) {
    console.error('Error loading sync status:', error);
    return {
      timestamp: new Date().toISOString(),
      status: 'error',
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0,
      inventory: 0,
      lastSync: null,
      syncError: 'Error loading sync status'
    };
  }
};

// Update sync status in localStorage
export const updateSyncStatus = (update: Partial<SimpleSyncStatus>): void => {
  try {
    const currentStatus = getSyncStatus();
    const updatedStatus = { ...currentStatus, ...update };
    localStorage.setItem('syncStatus', JSON.stringify(updatedStatus));
  } catch (error) {
    console.error('Error updating sync status:', error);
  }
};
