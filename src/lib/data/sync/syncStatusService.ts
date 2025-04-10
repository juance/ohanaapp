
import { SyncStatus } from './types';
import { getFromLocalStorage } from '../coreUtils';

export const getSyncStatus = (): SyncStatus => {
  // Get counts of unsynced data
  const tickets = getFromLocalStorage('tickets_data') || [];
  const unsyncedTickets = tickets.filter((ticket: any) => ticket.pendingSync).length;
  
  const expenses = getFromLocalStorage('expenses_data') || [];
  const unsyncedExpenses = expenses.filter((expense: any) => expense.pendingSync).length;
  
  const clients = getFromLocalStorage('clients_data') || [];
  const unsyncedClients = clients.filter((client: any) => client.pendingSync).length;
  
  const feedback = getFromLocalStorage('feedback_data') || [];
  const unsyncedFeedback = feedback.filter((item: any) => item.pendingSync).length;
  
  return {
    ticketsSync: unsyncedTickets,
    expensesSync: unsyncedExpenses,
    clientsSync: unsyncedClients,
    feedbackSync: unsyncedFeedback
  };
};
