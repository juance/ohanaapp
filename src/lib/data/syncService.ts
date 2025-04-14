
// This file re-exports all synchronization-related functionality
import { syncTickets } from './sync/ticketsSync';
import { syncClients } from './sync/clientsSync';
import { syncFeedback } from './sync/feedbackSync';
import { syncExpenses } from './sync/expensesSync';
import { getSyncStatus, updateSyncStatus } from './sync/syncStatusService';
import { syncComprehensive } from './sync/comprehensiveSync';

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
