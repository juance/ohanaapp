
import { syncExpenses } from '@/lib/data/expenseService';
import { syncTickets } from '@/lib/data/sync/ticketsSync';
import { syncClients } from '@/lib/data/sync/clientsSync';
import { syncFeedback } from '@/lib/data/sync/feedbackSync';
import { updateSyncStatus, getSyncStatus } from './syncStatusService';
import { SyncResult } from '@/lib/types/sync.types';

/**
 * Perform a comprehensive sync of all data types
 */
export const syncAllData = async (
  options: { 
    force?: boolean; 
    onProgress?: (progress: number) => void;
  } = {}
): Promise<SyncResult> => {
  // Get current sync status
  const syncStatus = getSyncStatus();
  
  try {
    // Start with 0% progress
    options.onProgress?.(0);

    // Create result object
    const result: SyncResult = {
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0,
      timestamp: new Date(),
      success: false
    };

    // Sync tickets (25% of progress)
    result.tickets = await syncTickets();
    options.onProgress?.(25);

    // Sync expenses (50% of progress)
    result.expenses = await syncExpenses();
    options.onProgress?.(50);
    
    // Sync clients (75% of progress)
    result.clients = await syncClients();
    options.onProgress?.(75);
    
    // Sync feedback (100% of progress)
    result.feedback = await syncFeedback();
    options.onProgress?.(100);

    // Update with successful sync
    result.success = true;
    updateSyncStatus({
      lastSync: new Date().toISOString(),
      syncError: null
    });
    
    return result;
  } catch (error) {
    console.error('Comprehensive sync failed:', error);
    
    // Update sync status with error
    updateSyncStatus({
      lastSync: new Date().toISOString(),
      syncError: error instanceof Error ? error.message : 'Unknown error during sync'
    });
    
    // Return failed result
    return {
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0,
      timestamp: new Date(),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during sync'
    };
  }
};
