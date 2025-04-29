
import { syncTickets } from './ticketsSync';
import { syncFeedback } from './feedbackSync';
import { syncClients } from './clientsSync';
import { syncExpenses } from './expensesSync';
import { updateSyncStatus } from './syncStatusService';
import { SyncableTicket, SyncableExpense, SyncableCustomerFeedback, SimpleSyncStatus } from '@/lib/types/sync.types';

/**
 * Perform a comprehensive synchronization of all offline data
 * @returns Object with counts of synced items
 */
export const syncComprehensive = async (): Promise<{
  tickets: number;
  clients: number;
  feedback: number;
  expenses: number;
  success: boolean;
}> => {
  try {
    console.log('Starting comprehensive data sync');
    
    // Create empty arrays for sync functions that expect them
    const emptyTickets: SyncableTicket[] = [];
    const emptyExpenses: SyncableExpense[] = [];
    const emptyFeedback: SyncableCustomerFeedback[] = [];
    
    // Sync tickets
    const ticketsCount = await syncTickets(emptyTickets);
    console.log(`Synced ${ticketsCount} tickets`);
    
    // Sync clients
    const clientsCount = await syncClients();
    console.log(`Synced ${clientsCount} clients`);
    
    // Sync feedback
    const feedbackCount = await syncFeedback(emptyFeedback);
    console.log(`Synced ${feedbackCount} feedback entries`);
    
    // Sync expenses
    const expensesCount = await syncExpenses(emptyExpenses);
    console.log(`Synced ${expensesCount} expense entries`);
    
    // Update sync status
    const syncStatus: SimpleSyncStatus = {
      tickets: ticketsCount,
      clients: clientsCount,
      feedback: feedbackCount,
      expenses: expensesCount
    };
    
    await updateSyncStatus(syncStatus);
    
    return {
      tickets: ticketsCount,
      clients: clientsCount,
      feedback: feedbackCount,
      expenses: expensesCount,
      success: true
    };
  } catch (error) {
    console.error('Error in comprehensive sync:', error);
    return {
      tickets: 0,
      clients: 0,
      feedback: 0,
      expenses: 0,
      success: false
    };
  }
};

// Alias for backward compatibility
export const syncAllData = syncComprehensive;
