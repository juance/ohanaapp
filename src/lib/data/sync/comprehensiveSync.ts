
import { syncExpenses } from '@/lib/data/expenseService';
import { syncTickets } from '@/lib/data/sync/ticketsSync';
import { syncClients } from '@/lib/data/sync/clientsSync';
import { syncFeedback } from '@/lib/data/sync/feedbackSync';
import { updateSyncStatus, getSyncStatus } from './syncStatusService';
import { SyncResult, SyncStats } from '@/lib/types/sync.types';

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
      tickets: { added: 0, updated: 0, failed: 0 },
      expenses: { added: 0, updated: 0, failed: 0 },
      clients: { added: 0, updated: 0, failed: 0 },
      feedback: { added: 0, updated: 0, failed: 0 },
      inventory: { added: 0, updated: 0, failed: 0 }, // Añadido para satisfacer SyncResult
      timestamp: new Date(),
      success: false
    };

    // Sync tickets (25% of progress)
    const ticketsResult = await syncTickets();
    // Convertir el resultado numérico a SyncStats
    result.tickets = typeof ticketsResult === 'number' 
      ? { added: ticketsResult, updated: 0, failed: 0 }
      : ticketsResult;
    options.onProgress?.(25);

    // Sync expenses (50% of progress)
    const expensesResult = await syncExpenses();
    // Convertir el resultado numérico a SyncStats
    result.expenses = typeof expensesResult === 'number'
      ? { added: expensesResult, updated: 0, failed: 0 }
      : expensesResult;
    options.onProgress?.(50);
    
    // Sync clients (75% of progress)
    const clientsResult = await syncClients();
    // Convertir el resultado numérico a SyncStats
    result.clients = typeof clientsResult === 'number'
      ? { added: clientsResult, updated: 0, failed: 0 }
      : clientsResult;
    options.onProgress?.(75);
    
    // Sync feedback (100% of progress)
    const feedbackResult = await syncFeedback();
    // Convertir el resultado numérico a SyncStats
    result.feedback = typeof feedbackResult === 'number'
      ? { added: feedbackResult, updated: 0, failed: 0 }
      : feedbackResult;
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
      tickets: { added: 0, updated: 0, failed: 0 },
      expenses: { added: 0, updated: 0, failed: 0 },
      clients: { added: 0, updated: 0, failed: 0 },
      feedback: { added: 0, updated: 0, failed: 0 },
      inventory: { added: 0, updated: 0, failed: 0 }, // Añadido para satisfacer SyncResult
      timestamp: new Date(),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during sync'
    };
  }
};
