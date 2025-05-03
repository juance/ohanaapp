
import { syncTickets } from './ticketsSync';
import { syncExpenses } from './expensesSync';
import { syncFeedback } from './feedbackSync';
import { syncClients } from './clientsSync';
import { updateSyncStatus } from './syncStatusService';

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
 * Synchronized all data with the server: tickets, expenses, feedback, and clients
 * @returns A SyncResult object with counts of each item type synced
 */
export const syncAllData = async (): Promise<SyncResult> => {
  const result: SyncResult = {
    tickets: 0,
    expenses: 0,
    feedback: 0,
    clients: 0,
    timestamp: new Date()
  };
  
  try {
    // Sync tickets
    try {
      result.tickets = await syncTickets();
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
    } catch (error) {
      console.error('Error syncing expenses:', error);
    }
    
    // Sync feedback
    try {
      result.feedback = await syncFeedback();
    } catch (error) {
      console.error('Error syncing feedback:', error);
    }
    
    // Sync clients
    try {
      result.clients = await syncClients();
    } catch (error) {
      console.error('Error syncing clients:', error);
    }
    
    // Update sync status
    updateSyncStatus({
      lastSync: new Date(),
      ticketsCount: result.tickets,
      expensesCount: result.expenses,
      feedbackCount: result.feedback,
      clientsCount: result.clients
    });
    
    return result;
  } catch (error) {
    console.error('Error during comprehensive sync:', error);
    return result;
  }
};
