
import { syncExpenses } from './expensesSync';
import { syncFeedback } from './feedbackSync';
import { syncClients } from './clientsSync';
import { syncTickets } from './ticketsSync';
import { SyncStatus } from '@/lib/types';

export const syncAllData = async (): Promise<SyncStatus> => {
  try {
    console.log('Starting comprehensive data sync...');
    
    // Sync clients first (as tickets might depend on them)
    const clientsStatus = await syncClients();
    console.log('Client sync status:', clientsStatus);
    
    // Then sync tickets
    const ticketsStatus = await syncTickets();
    console.log('Tickets sync status:', ticketsStatus);
    
    // Sync expenses
    const expensesStatus = await syncExpenses();
    console.log('Expenses sync status:', expensesStatus);
    
    // Sync feedback
    const feedbackStatus = await syncFeedback();
    console.log('Feedback sync status:', feedbackStatus);
    
    // Return combined sync status
    return {
      clientsSync: clientsStatus,
      ticketsSync: ticketsStatus,
      expensesSync: expensesStatus,
      feedbackSync: feedbackStatus
    };
  } catch (error) {
    console.error('Error during comprehensive sync:', error);
    // Return failure status
    return {
      clientsSync: 0,
      ticketsSync: 0,
      expensesSync: 0,
      feedbackSync: 0
    };
  }
};
