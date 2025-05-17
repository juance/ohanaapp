
import { syncAllData } from '@/lib/data/sync/comprehensiveSync';
import { SyncableTicket } from '@/lib/types/sync.types';
import { STORAGE_KEYS } from '@/lib/constants/storageKeys';
import { v4 as uuidv4 } from 'uuid';

/**
 * Test utility to verify synchronization functionality
 */
export const testSync = async (): Promise<{ success: boolean, results: any }> => {
  const results = {
    initialState: {
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0
    },
    testCreation: {
      ticket: false,
      expense: false,
      client: false,
      feedback: false
    },
    syncResults: {
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0
    },
    finalState: {
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0
    }
  };

  try {
    // 1. Check initial state
    const ticketsJSON = localStorage.getItem(STORAGE_KEYS.TICKETS);
    const tickets: SyncableTicket[] = ticketsJSON ? JSON.parse(ticketsJSON) : [];
    results.initialState.tickets = tickets.length;
    
    const expensesJSON = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const expenses = expensesJSON ? JSON.parse(expensesJSON) : [];
    results.initialState.expenses = expenses.length;
    
    const clientsJSON = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    const clients = clientsJSON ? JSON.parse(clientsJSON) : [];
    results.initialState.clients = clients.length;
    
    const feedbackJSON = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    const feedback = feedbackJSON ? JSON.parse(feedbackJSON) : [];
    results.initialState.feedback = feedback.length;
    
    // 2. Create test data
    // Test ticket
    try {
      const testTicket: SyncableTicket = {
        id: uuidv4(),
        ticketNumber: `TEST-${Math.floor(Math.random() * 10000)}`,
        total: 100,
        totalPrice: 100,
        paymentMethod: 'cash',
        status: 'pending',
        isPaid: false,
        createdAt: new Date().toISOString(),
        pendingSync: true,
        date: new Date().toISOString()
      };
      
      tickets.push(testTicket);
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
      results.testCreation.ticket = true;
    } catch (error) {
      console.error('Error creating test ticket:', error);
    }
    
    // 3. Run sync
    const syncResult = await syncAllData();
    results.syncResults = {
      tickets: syncResult.tickets,
      expenses: syncResult.expenses,
      clients: syncResult.clients,
      feedback: syncResult.feedback
    };
    
    // 4. Check final state
    const finalTicketsJSON = localStorage.getItem(STORAGE_KEYS.TICKETS);
    const finalTickets: SyncableTicket[] = finalTicketsJSON ? JSON.parse(finalTicketsJSON) : [];
    results.finalState.tickets = finalTickets.length;
    
    const finalExpensesJSON = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const finalExpenses = finalExpensesJSON ? JSON.parse(finalExpensesJSON) : [];
    results.finalState.expenses = finalExpenses.length;
    
    const finalClientsJSON = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    const finalClients = finalClientsJSON ? JSON.parse(finalClientsJSON) : [];
    results.finalState.clients = finalClients.length;
    
    const finalFeedbackJSON = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    const finalFeedback = finalFeedbackJSON ? JSON.parse(finalFeedbackJSON) : [];
    results.finalState.feedback = finalFeedback.length;
    
    // Verify sync worked - check that pendingSync is false for the test ticket
    const syncWorked = finalTickets.some(t => 
      t.ticketNumber.startsWith('TEST-') && t.pendingSync === false
    );
    
    return {
      success: syncWorked,
      results
    };
  } catch (error) {
    console.error('Error during sync test:', error);
    return {
      success: false,
      results,
      error
    };
  }
};

/**
 * Reset the test data created for sync testing
 */
export const cleanupSyncTest = async (): Promise<void> => {
  try {
    // Remove test tickets
    const ticketsJSON = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (ticketsJSON) {
      const tickets: SyncableTicket[] = JSON.parse(ticketsJSON);
      const filteredTickets = tickets.filter(t => !t.ticketNumber.startsWith('TEST-'));
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(filteredTickets));
    }
    
    console.log('Sync test cleanup completed');
  } catch (error) {
    console.error('Error during sync test cleanup:', error);
  }
};
