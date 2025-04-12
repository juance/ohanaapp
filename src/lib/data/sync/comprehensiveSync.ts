
import { updateSyncStatus } from './syncStatusService';
import { syncFeedback } from './feedbackSync';
import { syncClients } from './clientsSync';

export const performComprehensiveSync = async (): Promise<boolean> => {
  try {
    // Sync clients
    const clientsResult = await syncClients();
    console.log(`Synced ${clientsResult} clients`);

    // Sync feedback
    const feedbackResult = await syncFeedback();
    console.log(`Synced ${feedbackResult} feedback items`);

    // Update sync status
    await updateSyncStatus();

    return true;
  } catch (error) {
    console.error('Error during comprehensive sync:', error);
    return false;
  }
};
