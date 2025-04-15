
import { syncClients } from './data/sync/clientsSync';
import { syncFeedback } from './data/sync/feedbackSync';
import { updateSyncStatus, getSyncStatus as getSyncStatusFn } from './data/sync/syncStatusService';
import { SyncStatus, Customer, ClientVisit } from './types';
import { syncComprehensive } from './data/sync/comprehensiveSync';

/**
 * Comprehensive sync of all offline data with the Supabase backend
 */
const comprehensiveSync = async (): Promise<{
  tickets: number;
  clients: number;
  feedback: number;
  expenses: number;
  success: boolean;
}> => {
  try {
    // Use the syncComprehensive function
    return await syncComprehensive();
  } catch (error) {
    console.error('Error during comprehensive sync:', error);
    return {
      tickets: 0,
      clients: 0,
      feedback: 0,
      expenses: 0,
      success: false
    };
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
    return {
      tickets: 0,
      clients: 0,
      feedback: 0,
      expenses: 0,
      success: false
    };
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
      ticketsSync: 0,
      expensesSync: 0,
      clientsSync: 0,
      feedbackSync: 0,
      lastSync: ''
    };
  }
};

// Re-export functions from other modules that are needed elsewhere
export { getCustomerByPhone } from './data/customer/customerRetrievalService';
export { storeTicket } from './data/ticket/ticketStorageService';
export { getClientVisitFrequency } from './data/clientService';
export { addLoyaltyPoints, redeemLoyaltyPoints } from './data/customer/loyaltyService';
export { storeExpense, getStoredExpenses } from './data/expenseService';
