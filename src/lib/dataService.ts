
import { syncClients } from './data/sync/clientsSync';
import { syncFeedback } from './data/sync/feedbackSync';
import { updateSyncStatus, getSyncStatus as getSyncStatusFn } from './data/sync/syncStatusService';
import { SyncStatus } from './types';

/**
 * Comprehensive sync of all offline data with the Supabase backend
 */
const comprehensiveSync = async (): Promise<boolean> => {
  try {
    // Sync clients
    const clientsSynced = await syncClients();
    console.log(`Clients synced: ${clientsSynced}`);

    // Sync feedback
    const feedbackSynced = await syncFeedback();
    console.log(`Feedback synced: ${feedbackSynced}`);

    // Update sync status
    await updateSyncStatus();

    return true;
  } catch (error) {
    console.error('Error during comprehensive sync:', error);
    return false;
  }
};

/**
 * Sync offline data with the Supabase backend
 */
export const syncAllData = async () => {
  try {
    const result = await comprehensiveSync();
    return result;
  } catch (error) {
    console.error('Error syncing data:', error);
    return false;
  }
};

/**
 * Get the current sync status
 */
export const getSyncStatus = async (): Promise<SyncStatus> => {
  try {
    return await getSyncStatusFn();
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      lastSync: '',
      pending: {
        tickets: 0,
        clients: 0,
        feedback: 0,
        inventory: 0,
        expenses: 0
      }
    };
  }
};
