
import { getFromLocalStorage, saveToLocalStorage, TICKETS_STORAGE_KEY, EXPENSES_STORAGE_KEY } from './coreUtils';
import { storeTicketData } from './ticketService';
import { storeExpense } from './expenseService';

/**
 * Synchronize offline data with Supabase
 */
export const syncOfflineData = async (): Promise<boolean> => {
  try {
    // Get tickets that need to be synced
    const localTickets = getFromLocalStorage<any>(TICKETS_STORAGE_KEY);
    const ticketsToSync = localTickets.filter((ticket: any) => ticket.pendingSync);
    
    if (ticketsToSync.length === 0) return true;
    
    // Sync each ticket
    for (const ticket of ticketsToSync) {
      const customer = {
        name: ticket.customerName,
        phoneNumber: ticket.phoneNumber
      };
      
      const ticketData = {
        ticketNumber: ticket.ticketNumber,
        totalPrice: ticket.totalPrice,
        paymentMethod: ticket.paymentMethod,
        valetQuantity: ticket.valetQuantity,
        isPaidInAdvance: ticket.isPaid // Make sure we sync the paid status
      };
      
      // Call the storeTicketData function but skip localStorage fallback
      await storeTicketData(ticketData, customer, ticket.dryCleaningItems, ticket.laundryOptions);
      
      // Mark as synced in localStorage
      ticket.pendingSync = false;
    }
    
    // Update localStorage
    saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);
    
    // Do the same for expenses
    const localExpenses = getFromLocalStorage<any>(EXPENSES_STORAGE_KEY);
    const expensesToSync = localExpenses.filter((expense: any) => expense.pendingSync);
    
    if (expensesToSync.length > 0) {
      for (const expense of expensesToSync) {
        const expenseData = {
          description: expense.description,
          amount: expense.amount,
          date: expense.date
        };
        
        await storeExpense(expenseData);
        expense.pendingSync = false;
      }
      
      // Update localStorage
      saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
    }
    
    return true;
  } catch (error) {
    console.error('Error synchronizing offline data:', error);
    return false;
  }
};

/**
 * Reset local storage data
 */
export const resetLocalData = (): boolean => {
  try {
    // Reset tickets in localStorage
    saveToLocalStorage(TICKETS_STORAGE_KEY, []);
    
    // Reset expenses in localStorage
    saveToLocalStorage(EXPENSES_STORAGE_KEY, []);
    
    return true;
  } catch (error) {
    console.error('Error resetting local data:', error);
    return false;
  }
};
