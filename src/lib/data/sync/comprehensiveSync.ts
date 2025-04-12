
import { updateSyncStatus } from './syncStatusService';
import { syncFeedbackData } from './feedbackSync';
import { syncClientData } from './clientsSync';

/**
 * Perform a comprehensive sync of all data
 * This is the main function to sync all data types
 */
export const performComprehensiveSync = async (): Promise<boolean> => {
  try {
    // Sync clients
    const clientsResult = await syncClientData();
    console.log(`Synced ${clientsResult} clients`);

    // Sync feedback
    const feedbackResult = await syncFeedbackData();
    console.log(`Synced ${feedbackResult} feedback items`);

    // Update sync status
    await updateSyncStatus();

    return true;
  } catch (error) {
    console.error('Error during comprehensive sync:', error);
    return false;
  }
};

/**
 * Sync all data
 * This is an alias for performComprehensiveSync for backward compatibility
 */
export const syncAllData = performComprehensiveSync;
