
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage } from '../coreUtils';
import { handleError } from '@/lib/utils/errorHandling';

interface SyncStatus {
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

    const pendingClientsSync = localClients.filter(client => client?.pendingSync).length;
    const pendingFeedbackSync = localFeedback.filter(feedback => feedback?.pendingSync).length;
    const pendingTicketsSync = localTickets.filter(ticket => ticket?.pendingSync).length;
    const pendingExpensesSync = localExpenses.filter(expense => expense?.pendingSync).length;

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
 * Update sync status in Supabase
 */
export const updateSyncStatus = async (): Promise<void> => {
  try {
    const status = await getSyncStatus();
    
    // You can store the sync status in Supabase if needed
    // This is optional and can be implemented based on requirements
    const { error } = await supabase
      .from('sync_status')
      .upsert([
        {
          id: 'main_status',
          status: status,
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    
  } catch (error) {
    handleError(error, 'updateSyncStatus', 'Error al actualizar estado de sincronización', false);
  }
};
