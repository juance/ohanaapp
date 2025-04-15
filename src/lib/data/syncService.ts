
// This file re-exports all synchronization-related functionality
import { syncTickets } from './sync/ticketsSync';
import { syncClients } from './sync/clientsSync';
import { syncFeedback } from './sync/feedbackSync';
import { syncExpenses } from './sync/expensesSync';
import { getSyncStatus, updateSyncStatus } from './sync/syncStatusService';
import { syncComprehensive } from './sync/comprehensiveSync';

// Add a function to reset local data
export const resetLocalData = async (): Promise<boolean> => {
  try {
    // Clear all local storage items related to sync
    localStorage.removeItem('local_tickets');
    localStorage.removeItem('customer_feedback');
    localStorage.removeItem('local_clients');
    localStorage.removeItem('local_expenses');
    localStorage.removeItem('syncStatus');
    localStorage.removeItem('inventory_items');
    
    // You can add more items as needed
    
    console.log('Local data reset completed');
    return true;
  } catch (error) {
    console.error('Error resetting local data:', error);
    return false;
  }
};

export {
  syncTickets,
  syncClients,
  syncFeedback,
  syncExpenses,
  getSyncStatus,
  updateSyncStatus,
  syncComprehensive,
  syncComprehensive as syncAllData  // Alias for backward compatibility
};
