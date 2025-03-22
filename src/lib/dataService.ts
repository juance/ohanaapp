import { supabase } from '@/integrations/supabase/client';
import { 
  Ticket,
  Customer,
  Expense,
  DryCleaningItem,
  LaundryOption,
  PaymentMethod,
  ClientVisit
} from './types';
import { 
  getCustomerByPhone, 
  storeCustomer, 
  updateValetsCount, 
  useFreeValet 
} from './customerService';
import { getDailyMetrics, getWeeklyMetrics, getMonthlyMetrics } from './metricsService';
import { getClientVisitFrequency } from './clientService';
import { storeExpense, getStoredExpenses } from './expenseService';

// Local Storage Keys
const TICKETS_STORAGE_KEY = 'laundry_tickets';

// Helper Functions
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return [];
  }
};

// Utility to convert payment method to the format expected by the database
const formatPaymentMethod = (method: PaymentMethod): "cash" | "debit" | "mercadopago" | "cuentadni" => {
  if (method === "cuenta_dni") return "cuentadni";
  if (method === "mercadopago") return "mercadopago";
  return method as "cash" | "debit";
};

// Función para obtener el siguiente número de ticket desde la base de datos
const getNextTicketNumber = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .rpc('get_next_ticket_number');
      
    if (error) throw error;
    
    // Asegurar que el formato sea siempre 8 dígitos con ceros a la izquierda (por ejemplo: 00000001)
    // La función get_next_ticket_number debe devolver un número entero
    const formattedNumber = data.toString().padStart(8, '0');
    console.log('Número de ticket generado:', formattedNumber);
    return formattedNumber;
  } catch (error) {
    console.error('Error getting next ticket number:', error);
    // Fallback: generate a random number if DB function fails
    const randomNum = Math.floor(Math.random() * 100000000);
    return randomNum.toString().padStart(8, '0');
  }
};

// Ticket Functions
export const storeTicketData = async (
  ticket: {
    ticketNumber?: string; // Ahora es opcional, lo generamos automáticamente
    totalPrice: number;
    paymentMethod: PaymentMethod;
    valetQuantity: number;
    customDate?: Date;
    usesFreeValet?: boolean; // Nueva opción para usar valet gratis
  },
  customer: { name: string; phoneNumber: string },
  dryCleaningItems: Omit<DryCleaningItem, 'id' | 'ticketId'>[],
  laundryOptions: LaundryOption[]
): Promise<boolean> => {
  try {
    // Obtenemos el número de ticket (secuencial)
    const ticketNumber = await getNextTicketNumber();
    console.log("Número de ticket generado:", ticketNumber);
    
    // First, ensure customer exists
    let customerId: string;
    let existingCustomer = await getCustomerByPhone(customer.phoneNumber);
    
    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // Create new customer with default values
      const newCustomer = await storeCustomer({
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        loyaltyPoints: 0,
        valetsCount: 0,
        freeValets: 0
      });
      if (!newCustomer) throw new Error('Failed to create customer');
      customerId = newCustomer.id;
      existingCustomer = newCustomer;
    }
    
    // Si se utiliza un valet gratis, verificamos y actualizamos
    if (ticket.usesFreeValet) {
      const success = await useFreeValet(customerId);
      if (!success) {
        throw new Error('El cliente no tiene valets gratis disponibles');
      }
    } 
    // Si no es valet gratis y hay valets, actualizamos el conteo
    else if (ticket.valetQuantity > 0) {
      await updateValetsCount(customerId, ticket.valetQuantity);
    }
    
    // Prepare date field - use custom date if provided, otherwise use current date
    const ticketDate = ticket.customDate ? ticket.customDate.toISOString() : new Date().toISOString();
    
    // Insert ticket with 'ready' status by default
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        total: ticket.totalPrice,
        payment_method: formatPaymentMethod(ticket.paymentMethod),
        valet_quantity: ticket.valetQuantity,
        customer_id: customerId,
        status: 'ready', // Set status to ready by default
        date: ticketDate
      })
      .select('*')
      .single();
    
    if (ticketError) throw ticketError;
    
    // Insert dry cleaning items if any
    if (dryCleaningItems.length > 0) {
      const itemsToInsert = dryCleaningItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        ticket_id: ticketData.id
      }));
      
      const { error: itemsError } = await supabase
        .from('dry_cleaning_items')
        .insert(itemsToInsert);
      
      if (itemsError) throw itemsError;
    }
    
    // Insert laundry options if any
    if (laundryOptions.length > 0) {
      const optionsToInsert = laundryOptions.map(option => ({
        ticket_id: ticketData.id,
        option_type: option
      }));
      
      const { error: optionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(optionsToInsert);
      
      if (optionsError) throw optionsError;
    }
    
    return true;
  } catch (error) {
    console.error('Error storing data in Supabase:', error);
    
    // Fallback to localStorage
    try {
      const localTickets = getFromLocalStorage<any>(TICKETS_STORAGE_KEY);
      
      const newTicket = {
        id: crypto.randomUUID(),
        ticketNumber: ticket.ticketNumber || `OFFLINE-${Date.now()}`,
        customerName: customer.name,
        phoneNumber: customer.phoneNumber,
        totalPrice: ticket.totalPrice,
        paymentMethod: ticket.paymentMethod,
        valetQuantity: ticket.valetQuantity,
        dryCleaningItems: dryCleaningItems,
        laundryOptions: laundryOptions,
        createdAt: ticket.customDate ? ticket.customDate.toISOString() : new Date().toISOString(),
        pendingSync: true
      };
      
      localTickets.push(newTicket);
      saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);
      return true;
    } catch (localError) {
      console.error('Error saving to localStorage:', localError);
      return false;
    }
  }
};

// Function to get stored tickets
export const getStoredTickets = async (startDate?: Date, endDate?: Date): Promise<any[]> => {
  try {
    let query = supabase
      .from('tickets')
      .select(`
        *,
        customers (name, phone),
        dry_cleaning_items (*),
        ticket_laundry_options (*)
      `);
    
    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the data to match our application structure
    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      customerName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total,
      paymentMethod: ticket.payment_method,
      valetQuantity: ticket.valet_quantity,
      dryCleaningItems: ticket.dry_cleaning_items || [],
      laundryOptions: ticket.ticket_laundry_options?.map((opt: any) => opt.option_type) || [],
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at
    }));
  } catch (error) {
    console.error('Error retrieving tickets from Supabase:', error);
    
    // Fallback to localStorage
    const localTickets = getFromLocalStorage<any>(TICKETS_STORAGE_KEY);
    
    // Filter by date if provided
    if (startDate || endDate) {
      return localTickets.filter((ticket: any) => {
        const ticketDate = new Date(ticket.createdAt);
        
        if (startDate && ticketDate < startDate) return false;
        if (endDate && ticketDate > endDate) return false;
        
        return true;
      });
    }
    
    return localTickets;
  }
};

// Function to synchronize offline data
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
        valetQuantity: ticket.valetQuantity
      };
      
      // Call the storeTicketData function but skip localStorage fallback
      await storeTicketData(ticketData, customer, ticket.dryCleaningItems, ticket.laundryOptions);
      
      // Mark as synced in localStorage
      ticket.pendingSync = false;
    }
    
    // Update localStorage
    saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);
    
    // Do the same for expenses
    const EXPENSES_STORAGE_KEY = 'laundry_expenses';
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

// Export dependencies for backward compatibility
export { 
  getCustomerByPhone, 
  storeCustomer, 
  getClientVisitFrequency,
  getDailyMetrics,
  getWeeklyMetrics,
  getMonthlyMetrics,
  storeExpense,
  getStoredExpenses,
  updateValetsCount,
  useFreeValet
};
