
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage } from '../coreUtils';
import { handleError } from '@/lib/utils/errorHandling';

export interface SyncStatus {
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
}

/**
 * Get current sync status
 */
export const getSyncStatus = async (): Promise<SyncStatus> => {
  try {
    // Count pending sync items
    const localClients = getFromLocalStorage<any[]>('clients') || [];
    const localFeedback = getFromLocalStorage<any[]>('customer_feedback') || [];
    const localTickets = getFromLocalStorage<any[]>('tickets') || [];
    const localExpenses = getFromLocalStorage<any[]>('expenses') || [];

    // We need to iterate through each item in the arrays to check pendingSync
    const pendingClientsSync = localClients.filter(client => client && client.pendingSync).length;
    const pendingFeedbackSync = localFeedback.filter(feedback => feedback && feedback.pendingSync).length;
    const pendingTicketsSync = localTickets.filter(ticket => ticket && ticket.pendingSync).length;
    const pendingExpensesSync = localExpenses.filter(expense => expense && expense.pendingSync).length;

    return {
      clientsSync: pendingClientsSync,
      feedbackSync: pendingFeedbackSync,
      ticketsSync: pendingTicketsSync,
      expensesSync: pendingExpensesSync
    };
  } catch (error) {
    handleError(error, 'getSyncStatus', 'Error al obtener estado de sincronización', false);
    // Return empty counts in case of error
    return {
      clientsSync: 0,
      feedbackSync: 0,
      ticketsSync: 0,
      expensesSync: 0
    };
  }
};

/**
 * Update sync status in local storage
 * We'll skip saving to Supabase since the sync_status table might not exist
 */
export const updateSyncStatus = async (): Promise<void> => {
  try {
    const status = await getSyncStatus();
    
    // Store status in localStorage for now instead of Supabase
    localStorage.setItem('sync_status', JSON.stringify({
      status,
      updated_at: new Date().toISOString()
    }));
    
    console.log('Sync status updated:', status);
  } catch (error) {
    handleError(error, 'updateSyncStatus', 'Error al actualizar estado de sincronización', false);
  }
};
