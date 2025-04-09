
import { getFromLocalStorage } from '../coreUtils';
import { TICKETS_STORAGE_KEY, EXPENSES_STORAGE_KEY } from '../coreUtils';
import { LocalClient } from './types';
import { CustomerFeedback } from '@/lib/types';
import { SyncStatus } from './types';

/**
 * Get synchronization status for all data types
 */
export const getSyncStatus = async (): Promise<SyncStatus> => {
  try {
    // Get counts of data that needs to be synced
    const localTickets = getFromLocalStorage<any[]>(TICKETS_STORAGE_KEY) || [];
    const ticketsSync = localTickets.filter((t) => t && typeof t === 'object' && 'pendingSync' in t && t.pendingSync).length;
    
    const localExpenses = getFromLocalStorage<any[]>(EXPENSES_STORAGE_KEY) || [];
    const expensesSync = localExpenses.filter((e) => e && typeof e === 'object' && 'pendingSync' in e && e.pendingSync).length;
    
    const localClients = getFromLocalStorage<LocalClient[]>('clients_data') || [];
    const clientsSync = localClients.filter((c) => c && typeof c === 'object' && 'pendingSync' in c && c.pendingSync).length;
    
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>('customer_feedback') || [];
    const feedbackSync = localFeedback.filter((f) => f && typeof f === 'object' && 'pendingSync' in f && f.pendingSync).length;
    
    return {
      ticketsSync,
      expensesSync,
      clientsSync,
      feedbackSync
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      ticketsSync: 0,
      expensesSync: 0,
      clientsSync: 0,
      feedbackSync: 0
    };
  }
};
