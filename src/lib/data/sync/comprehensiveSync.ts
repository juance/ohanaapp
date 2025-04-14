
import { syncTickets } from './ticketsSync';
import { syncFeedback } from './feedbackSync';
import { syncClients } from './clientsSync';
import { syncExpenses } from './expensesSync';
import { updateSyncStatus } from './syncStatusService';

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
    
    // Sync tickets
    const ticketsCount = await syncTickets();
    console.log(`Synced ${ticketsCount} tickets`);
    
    // Sync clients
    const clientsCount = await syncClients();
    console.log(`Synced ${clientsCount} clients`);
    
    // Sync feedback
    const feedbackCount = await syncFeedback();
    console.log(`Synced ${feedbackCount} feedback entries`);
    
    // Sync expenses
    const expensesCount = await syncExpenses();
    console.log(`Synced ${expensesCount} expense entries`);
    
    // Update sync status
    await updateSyncStatus({
      ticketsSync: ticketsCount,
      clientsSync: clientsCount,
      feedbackSync: feedbackCount,
      expensesSync: expensesCount
    });
    
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
