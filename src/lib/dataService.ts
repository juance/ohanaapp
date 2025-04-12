import { syncClients } from './data/sync/clientsSync';
import { syncFeedback } from './data/sync/feedbackSync';
import { updateSyncStatus, getSyncStatus as getSyncStatusFn } from './data/sync/syncStatusService';
import { syncTickets } from './data/sync/ticketsSync';
import { syncInventory } from './data/sync/inventorySync';
import { syncExpenses } from './data/sync/expensesSync';
import { SyncStatus } from './types';

/**
 * Comprehensive sync of all offline data with the Supabase backend
 */
const comprehensiveSync = async (): Promise<boolean> => {
  try {
    // Sync tickets
    const ticketsSynced = await syncTickets();
    console.log(`Tickets synced: ${ticketsSynced}`);

    // Sync clients
    const clientsSynced = await syncClients();
    console.log(`Clients synced: ${clientsSynced}`);

    // Sync feedback
    const feedbackSynced = await syncFeedback();
    console.log(`Feedback synced: ${feedbackSynced}`);

    // Sync inventory
    const inventorySynced = await syncInventory();
    console.log(`Inventory synced: ${inventorySynced}`);

    // Sync expenses
    const expensesSynced = await syncExpenses();
    console.log(`Expenses synced: ${expensesSynced}`);

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
