
import { syncClientsData } from './clientsSync';
import { syncFeedbackData } from './feedbackSync';
import { syncMetricsData } from './metricsSync';
import { getSyncStatus as getStatus } from './syncStatusService';
import { dispatchSyncCompletedEvent } from '@/lib/notificationService';
import { SyncStatus } from './types';
import { handleError } from '@/lib/utils/errorHandling';

/**
 * Synchronize all data with the backend
 */
export const syncAllData = async (): Promise<boolean> => {
  try {
    // Get initial sync counts to calculate how many items were synced
    const initialStatus = await getSyncStatus();
    const initialTotal = 
      initialStatus.ticketsSync + 
      initialStatus.expensesSync + 
      initialStatus.clientsSync + 
      initialStatus.feedbackSync;
    
    // Sync all data types
    const clientsSuccess = await syncClientsData();
    const feedbackSuccess = await syncFeedbackData();
    const metricsSuccess = await syncMetricsData();
    
    // Get final sync status to see what's left
    const finalStatus = await getSyncStatus();
    const finalTotal = 
      finalStatus.ticketsSync + 
      finalStatus.expensesSync + 
      finalStatus.clientsSync + 
      finalStatus.feedbackSync;
    
    // Calculate how many items were successfully synced
    const syncedItemCount = Math.max(0, initialTotal - finalTotal);
    
    // Dispatch event for notifications
    if (syncedItemCount > 0) {
      dispatchSyncCompletedEvent(syncedItemCount);
    }
    
    return clientsSuccess && feedbackSuccess && metricsSuccess;
  } catch (error) {
    handleError(error, 'syncAllData', 'Error al sincronizar todos los datos', false);
    return false;
  }
};

/**
 * Get current sync status across all data types
 */
export const getSyncStatus = async (): Promise<SyncStatus> => {
  return getStatus();
};
