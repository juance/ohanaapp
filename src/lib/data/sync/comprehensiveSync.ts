
import { syncTickets } from './ticketsSync';
import { syncExpenses } from './expensesSync';
import { syncFeedback } from './feedbackSync';
import { syncClients } from './clientsSync';
import { updateSyncStatus, getSyncStatus } from './syncStatusService';
import { toast } from '@/lib/toast';

/**
 * Interface for comprehensive sync result
 */
interface SyncResult {
  tickets: number;
  expenses: number;
  feedback: number;
  clients: number;
  timestamp: Date;
}

/**
 * Synchronize all data with the server: tickets, expenses, feedback, and clients
 * @param showNotifications Whether to show toast notifications
 * @returns A SyncResult object with counts of each item type synced
 */
export const syncAllData = async (showNotifications = false): Promise<SyncResult> => {
  const result: SyncResult = {
    tickets: 0,
    expenses: 0,
    feedback: 0,
    clients: 0,
    timestamp: new Date()
  };
  
  if (showNotifications) {
    toast.info('Sincronizando datos...');
  }
  
  try {
    // Sync tickets
    try {
      result.tickets = await syncTickets();
      console.log(`Synced ${result.tickets} tickets`);
    } catch (error) {
      console.error('Error syncing tickets:', error);
    }
    
    // Sync expenses
    try {
      const expensesFromStorage = localStorage.getItem('expenses');
      let expenses = [];
      
      if (expensesFromStorage) {
        expenses = JSON.parse(expensesFromStorage);
      }
      
      result.expenses = await syncExpenses(expenses);
      console.log(`Synced ${result.expenses} expenses`);
    } catch (error) {
      console.error('Error syncing expenses:', error);
    }
    
    // Sync feedback
    try {
      result.feedback = await syncFeedback();
      console.log(`Synced ${result.feedback} feedback items`);
    } catch (error) {
      console.error('Error syncing feedback:', error);
    }
    
    // Sync clients
    try {
      result.clients = await syncClients();
      console.log(`Synced ${result.clients} clients`);
    } catch (error) {
      console.error('Error syncing clients:', error);
    }
    
    // Update sync status
    updateSyncStatus({
      lastSync: result.timestamp,
      tickets: result.tickets,
      expenses: result.expenses,
      clients: result.clients,
      feedback: result.feedback
    });
    
    const totalSynced = result.tickets + result.expenses + result.clients + result.feedback;
    
    if (showNotifications) {
      if (totalSynced > 0) {
        toast.success(`Sincronización completada: ${totalSynced} elementos sincronizados`);
      } else {
        toast.info('No hay cambios para sincronizar');
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error during comprehensive sync:', error);
    if (showNotifications) {
      toast.error('Error durante la sincronización');
    }
    return result;
  }
};

/**
 * Check if there are any pending items to sync
 * @returns Boolean indicating if there are pending sync items
 */
export const hasPendingSyncItems = (): boolean => {
  const status = getSyncStatus();
  return (
    (status.tickets || 0) +
    (status.expenses || 0) +
    (status.clients || 0) +
    (status.feedback || 0)
  ) > 0;
};

/**
 * Get the count of pending sync items
 * @returns Number of items pending sync
 */
export const getPendingSyncCount = (): number => {
  const status = getSyncStatus();
  return (
    (status.tickets || 0) +
    (status.expenses || 0) +
    (status.clients || 0) +
    (status.feedback || 0)
  );
};
