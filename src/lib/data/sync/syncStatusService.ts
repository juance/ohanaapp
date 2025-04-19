
import { SyncStatus } from '@/lib/types';

// Get sync status
export const getSyncStatus = (): SyncStatus => {
  try {
    // Initialize status with default values
    const status: SyncStatus = {
      ticketsSync: {
        lastSync: null,
        pendingCount: 0,
        error: null
      },
      expensesSync: {
        lastSync: null,
        pendingCount: 0,
        error: null
      },
      clientsSync: {
        lastSync: null,
        pendingCount: 0,
        error: null
      },
      feedbackSync: {
        lastSync: null,
        pendingCount: 0,
        error: null
      }
    };
    
    return status;
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      ticketsSync: { lastSync: null, pendingCount: 0, error: String(error) },
      expensesSync: { lastSync: null, pendingCount: 0, error: String(error) },
      clientsSync: { lastSync: null, pendingCount: 0, error: String(error) },
      feedbackSync: { lastSync: null, pendingCount: 0, error: String(error) }
    };
  }
};
