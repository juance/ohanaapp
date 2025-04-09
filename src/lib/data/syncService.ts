
import { getFromLocalStorage, saveToLocalStorage, TICKETS_STORAGE_KEY, EXPENSES_STORAGE_KEY } from './coreUtils';
import { storeTicketData } from './ticketService';
import { storeExpense } from './expenseService';
import { toast } from '@/lib/toast';

/**
 * Synchronize offline data with Supabase
 */
export const syncOfflineData = async (): Promise<boolean> => {
  try {
    let syncStatus = {
      tickets: 0,
      expenses: 0,
      success: true
    };

    // Get tickets that need to be synced
    const localTickets = getFromLocalStorage<any>(TICKETS_STORAGE_KEY) || [];
    const ticketsToSync = localTickets.filter((ticket: any) => ticket.pendingSync);
    
    if (ticketsToSync.length > 0) {
      console.log(`Found ${ticketsToSync.length} tickets to sync`);
      
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
        
        try {
          console.log(`Syncing ticket ${ticket.ticketNumber} for ${ticket.customerName}`);
          
          // Call the storeTicketData function but skip localStorage fallback
          await storeTicketData(ticketData, customer, ticket.dryCleaningItems || [], ticket.laundryOptions || []);
          
          // Mark as synced in localStorage
          ticket.pendingSync = false;
          syncStatus.tickets++;
          console.log(`Successfully synced ticket ${ticket.ticketNumber}`);
        } catch (syncError) {
          console.error(`Error syncing ticket ${ticket.ticketNumber}:`, syncError);
          syncStatus.success = false;
          // Continue with other tickets
        }
      }
      
      // Update localStorage
      saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);
    }
    
    // Do the same for expenses
    const localExpenses = getFromLocalStorage<any>(EXPENSES_STORAGE_KEY) || [];
    const expensesToSync = localExpenses.filter((expense: any) => expense.pendingSync);
    
    if (expensesToSync.length > 0) {
      console.log(`Found ${expensesToSync.length} expenses to sync`);
      
      for (const expense of expensesToSync) {
        const expenseData = {
          description: expense.description,
          amount: expense.amount,
          date: expense.date
        };
        
        try {
          console.log(`Syncing expense: ${expense.description}`);
          await storeExpense(expenseData);
          expense.pendingSync = false;
          syncStatus.expenses++;
          console.log(`Successfully synced expense: ${expense.description}`);
        } catch (syncError) {
          console.error(`Error syncing expense:`, syncError);
          syncStatus.success = false;
          // Continue with other expenses
        }
      }
      
      // Update localStorage
      saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
    }
    
    // Show toast with sync results if any data was synced
    if (syncStatus.tickets > 0 || syncStatus.expenses > 0) {
      if (syncStatus.success) {
        toast({
          title: "Sincronización completada",
          description: `Se sincronizaron ${syncStatus.tickets} tickets y ${syncStatus.expenses} gastos.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sincronización parcial",
          description: `Algunos elementos no pudieron sincronizarse. Revise la consola para más detalles.`
        });
      }
    }
    
    return syncStatus.success;
  } catch (error) {
    console.error('Error synchronizing offline data:', error);
    toast({
      variant: "destructive",
      title: "Error de sincronización",
      description: "Ocurrió un error durante la sincronización de datos"
    });
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
    
    // Reset other local data
    localStorage.removeItem('dashboard_metrics');
    localStorage.removeItem('clients_data');
    localStorage.removeItem('ticket_analysis_cache');
    localStorage.removeItem('customer_feedback');
    
    console.log('Local data reset successfully');
    toast({
      title: "Datos locales reiniciados",
      description: "Todos los datos almacenados localmente han sido eliminados"
    });
    
    return true;
  } catch (error) {
    console.error('Error resetting local data:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "No se pudieron reiniciar los datos locales"
    });
    return false;
  }
};
