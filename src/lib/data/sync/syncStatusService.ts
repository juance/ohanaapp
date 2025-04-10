
import { getFromLocalStorage } from '../coreUtils';
import { TICKETS_STORAGE_KEY, EXPENSES_STORAGE_KEY } from '../coreUtils';
import { SyncStatus } from './types';

/**
 * Get synchronization status for all data types
 */
export const getSyncStatus = async (): Promise<SyncStatus> => {
  try {
    // Get counts of data that needs to be synced
    const localTickets = getFromLocalStorage<any[]>(TICKETS_STORAGE_KEY) || [];
    const ticketsSync = localTickets.filter((ticket) => ticket && typeof ticket === 'object' && 'pendingSync' in ticket && ticket.pendingSync).length;
    
    const localExpenses = getFromLocalStorage<any[]>(EXPENSES_STORAGE_KEY) || [];
    const expensesSync = localExpenses.filter((expense) => expense && typeof expense === 'object' && 'pendingSync' in expense && expense.pendingSync).length;
    
    const localClients = getFromLocalStorage<any[]>('clients_data') || [];
    const clientsSync = localClients.filter((client) => client && typeof client === 'object' && 'pendingSync' in client && client.pendingSync).length;
    
    const localFeedback = getFromLocalStorage<any[]>('customer_feedback') || [];
    const feedbackSync = localFeedback.filter((feedback) => feedback && typeof feedback === 'object' && 'pendingSync' in feedback && feedback.pendingSync).length;
    
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
