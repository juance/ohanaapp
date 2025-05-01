
import { syncFeedback } from './feedbackSync';
import { syncClients } from './clientsSync';
import { syncExpenses } from './expensesSync';
import { SimpleSyncStatus } from '@/lib/types';
import { toast } from '@/lib/toast';

// LocalStorage key for storing last sync timestamp
const LAST_SYNC_KEY = 'lastSyncTimestamp';

/**
 * Get the timestamp of the last successful sync
 */
export const getLastSyncTimestamp = (): Date | null => {
  const timestamp = localStorage.getItem(LAST_SYNC_KEY);
  if (!timestamp) return null;
  
  try {
    return new Date(JSON.parse(timestamp));
  } catch {
    return null;
  }
};

/**
 * Set the timestamp of a successful sync
 */
export const setLastSyncTimestamp = (date: Date = new Date()): void => {
  localStorage.setItem(LAST_SYNC_KEY, JSON.stringify(date.toISOString()));
};

/**
 * Run a comprehensive sync of all data types
 */
export const runComprehensiveSync = async (): Promise<SimpleSyncStatus> => {
  try {
    // Start with empty counts
    let syncedClients = 0;
    let syncedFeedback = 0;
    let syncedExpenses = 0;
    let syncedTickets = 0;
    
    // Run all sync operations
    try {
      syncedClients = await syncClients();
      console.log(`Synced ${syncedClients} clients`);
    } catch (error) {
      console.error('Error syncing clients:', error);
    }
    
    try {
      syncedFeedback = await syncFeedback();
      console.log(`Synced ${syncedFeedback} feedback items`);
    } catch (error) {
      console.error('Error syncing feedback:', error);
    }
    
    try {
      syncedExpenses = await syncExpenses();
      console.log(`Synced ${syncedExpenses} expenses`);
    } catch (error) {
      console.error('Error syncing expenses:', error);
    }
    
    // Create sync status summary
    const syncStatus: SimpleSyncStatus = {
      clients: syncedClients,
      feedback: syncedFeedback,
      expenses: syncedExpenses,
      tickets: syncedTickets,
      lastSync: new Date()
    };
    
    // Update last sync timestamp if anything was synced
    const totalSynced = syncedClients + syncedFeedback + syncedExpenses + syncedTickets;
    if (totalSynced > 0) {
      setLastSyncTimestamp();
      toast.success(`Sincronización completa: ${totalSynced} elementos`);
    } else {
      toast.success('Todo está sincronizado');
    }
    
    return syncStatus;
  } catch (error) {
    console.error('Error in comprehensive sync:', error);
    toast.error('Error durante la sincronización');
    throw error;
  }
};

/**
 * Calculate total pending sync items count
 */
export const getPendingSyncCount = async (): Promise<number> => {
  // This is a placeholder; in a real implementation, you would
  // count the pending items from each module
  return 0;
};
