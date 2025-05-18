
import { SyncResult } from '@/lib/types/sync.types';
import { dispatchSyncCompletedEvent } from '@/lib/notificationService';

// Mock function for syncing data
export const syncAllData = async (): Promise<SyncResult> => {
  // This would be replaced with actual sync logic
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful sync with some data
      const result: SyncResult = {
        tickets: 3,
        expenses: 2,
        clients: 1,
        feedback: 0,
        timestamp: new Date(),
        success: true
      };
      
      // Dispatch event for notifications
      dispatchSyncCompletedEvent(result.tickets + result.expenses + result.clients + result.feedback);
      
      resolve(result);
    }, 2000);
  });
};
