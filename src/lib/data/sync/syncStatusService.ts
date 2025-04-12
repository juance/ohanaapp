
import { SyncStatus } from '../../types';

/**
 * Get current sync status
 */
export const getSyncStatus = async (): Promise<SyncStatus> => {
  const storedStatus = localStorage.getItem('syncStatus');
  
  if (storedStatus) {
    try {
      return JSON.parse(storedStatus);
    } catch (e) {
      console.error('Error parsing sync status:', e);
    }
  }
  
  // Return default sync status if none exists
  return {
    lastSync: '',
    pending: {
      tickets: 0,
      clients: 0,
      feedback: 0,
      inventory: 0,
      expenses: 0
    }
  };
};

/**
 * Update sync status with current pending counts
 */
export const updateSyncStatus = async (): Promise<SyncStatus> => {
  try {
    // Count pending items for each category
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    
    const pendingTickets = Array.isArray(tickets) ? tickets.filter(item => item.pendingSync).length : 0;
    const pendingClients = Array.isArray(clients) ? clients.filter(item => item.pendingSync).length : 0;
    const pendingFeedback = Array.isArray(feedback) ? feedback.filter(item => item.pendingSync).length : 0;
    const pendingInventory = Array.isArray(inventory) ? inventory.filter(item => item.pendingSync).length : 0;
    const pendingExpenses = Array.isArray(expenses) ? expenses.filter(item => item.pendingSync).length : 0;
    
    const status: SyncStatus = {
      lastSync: new Date().toISOString(),
      pending: {
        tickets: pendingTickets,
        clients: pendingClients,
        feedback: pendingFeedback,
        inventory: pendingInventory,
        expenses: pendingExpenses
      }
    };
    
    // Save to localStorage
    localStorage.setItem('syncStatus', JSON.stringify(status));
    
    return status;
  } catch (error) {
    console.error('Error updating sync status:', error);
    
    // Return default status in case of error
    return {
      lastSync: new Date().toISOString(),
      pending: {
        tickets: 0,
        clients: 0,
        feedback: 0,
        inventory: 0,
        expenses: 0
      }
    };
  }
};
