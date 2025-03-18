import { supabase } from '@/integrations/supabase/client';
import { 
  Ticket,
  Customer,
  Expense,
  DryCleaningItem,
  LaundryOption,
  PaymentMethod,
  ClientVisit,
  DailyMetrics,
  WeeklyMetrics,
  MonthlyMetrics
} from './types';

// Local Storage Keys
const TICKETS_STORAGE_KEY = 'laundry_tickets';
const EXPENSES_STORAGE_KEY = 'laundry_expenses';

// Helper Functions
const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getFromLocalStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return [];
  }
};

// Customer Functions
export const storeCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ 
        name: customer.name, 
        phone: customer.phoneNumber 
      }])
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error storing customer in Supabase:', error);
    return null;
  }
};

export const getCustomerByPhone = async (phoneNumber: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phoneNumber)
      .single();
    
    if (error) throw error;
    
    return data ? {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone,
      createdAt: data.created_at
    } : null;
  } catch (error) {
    console.error('Error retrieving customer from Supabase:', error);
    return null;
  }
};

// Utility to convert payment method to the format expected by the database
const formatPaymentMethod = (method: PaymentMethod): "cash" | "debit" | "mercadopago" | "cuentadni" => {
  if (method === "cuenta_dni") return "cuentadni";
  if (method === "mercado_pago") return "mercadopago";
  return method as "cash" | "debit";
};

// Ticket Functions
export const storeTicketData = async (
  ticket: {
    ticketNumber: string;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    valetQuantity: number;
  },
  customer: { name: string; phoneNumber: string },
  dryCleaningItems: Omit<DryCleaningItem, 'id' | 'ticketId'>[],
  laundryOptions: LaundryOption[]
): Promise<boolean> => {
  try {
    // First, ensure customer exists
    let customerId: string;
    const existingCustomer = await getCustomerByPhone(customer.phoneNumber);
    
    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const newCustomer = await storeCustomer(customer);
      if (!newCustomer) throw new Error('Failed to create customer');
      customerId = newCustomer.id;
    }
    
    // Insert ticket with 'ready' status by default
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticket.ticketNumber,
        total: ticket.totalPrice,
        payment_method: formatPaymentMethod(ticket.paymentMethod),
        valet_quantity: ticket.valetQuantity,
        customer_id: customerId,
        status: 'ready' // Set status to ready by default
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
        ticketNumber: ticket.ticketNumber,
        customerName: customer.name,
        phoneNumber: customer.phoneNumber,
        totalPrice: ticket.totalPrice,
        paymentMethod: ticket.paymentMethod,
        valetQuantity: ticket.valetQuantity,
        dryCleaningItems: dryCleaningItems,
        laundryOptions: laundryOptions,
        createdAt: new Date().toISOString(),
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

// Expense Functions
export const storeExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .insert([{
        description: expense.description,
        amount: expense.amount,
        date: expense.date
      }]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error storing expense in Supabase:', error);
    
    // Fallback to localStorage
    try {
      const localExpenses = getFromLocalStorage<Expense>(EXPENSES_STORAGE_KEY);
      
      const newExpense: Expense = {
        id: crypto.randomUUID(),
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        createdAt: new Date().toISOString()
      };
      
      localExpenses.push(newExpense);
      saveToLocalStorage(EXPENSES_STORAGE_KEY, localExpenses);
      return true;
    } catch (localError) {
      console.error('Error saving expense to localStorage:', localError);
      return false;
    }
  }
};

export const getStoredExpenses = async (startDate?: Date, endDate?: Date): Promise<Expense[]> => {
  try {
    let query = supabase.from('expenses').select('*');
    
    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map((expense: any) => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      createdAt: expense.created_at
    }));
  } catch (error) {
    console.error('Error retrieving expenses from Supabase:', error);
    
    // Fallback to localStorage
    const localExpenses = getFromLocalStorage<Expense>(EXPENSES_STORAGE_KEY);
    
    // Filter by date if provided
    if (startDate || endDate) {
      return localExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        
        if (startDate && expenseDate < startDate) return false;
        if (endDate && expenseDate > endDate) return false;
        
        return true;
      });
    }
    
    return localExpenses;
  }
};

// Client Visit Frequency
export const getClientVisitFrequency = async (): Promise<ClientVisit[]> => {
  try {
    // Fix: Use another approach since the function doesn't exist in the database
    const { data, error } = await supabase
      .from('tickets')
      .select('customers(name, phone), created_at');
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    // Process the data to calculate visit frequency
    const clientVisits = new Map<string, { name: string; visits: string[]; lastVisit: string }>();
    
    data.forEach((ticket: any) => {
      if (!ticket.customers) return;
      
      const phoneNumber = ticket.customers.phone;
      const name = ticket.customers.name;
      const visitDate = ticket.created_at;
      
      if (clientVisits.has(phoneNumber)) {
        const client = clientVisits.get(phoneNumber)!;
        client.visits.push(visitDate);
        
        // Update last visit if newer
        if (new Date(visitDate) > new Date(client.lastVisit)) {
          client.lastVisit = visitDate;
        }
      } else {
        clientVisits.set(phoneNumber, {
          name,
          visits: [visitDate],
          lastVisit: visitDate
        });
      }
    });
    
    // Convert to array and sort by visit count
    const result: ClientVisit[] = Array.from(clientVisits.entries()).map(([phoneNumber, data]) => ({
      phoneNumber,
      clientName: data.name,
      visitCount: data.visits.length,
      lastVisit: data.lastVisit
    }));
    
    return result.sort((a, b) => b.visitCount - a.visitCount);
  } catch (error) {
    console.error('Error retrieving client visit frequency:', error);
    
    // Fallback calculation using localStorage
    try {
      const localTickets = getFromLocalStorage<any>(TICKETS_STORAGE_KEY);
      
      // Group by phone number
      const clientsMap = new Map<string, { name: string; visits: string[]; lastVisit: string }>();
      
      localTickets.forEach((ticket: any) => {
        if (!ticket.phoneNumber) return;
        
        if (clientsMap.has(ticket.phoneNumber)) {
          const client = clientsMap.get(ticket.phoneNumber)!;
          client.visits.push(ticket.createdAt);
          
          // Update last visit if newer
          if (new Date(ticket.createdAt) > new Date(client.lastVisit)) {
            client.lastVisit = ticket.createdAt;
          }
        } else {
          clientsMap.set(ticket.phoneNumber, {
            name: ticket.customerName,
            visits: [ticket.createdAt],
            lastVisit: ticket.createdAt
          });
        }
      });
      
      // Convert map to array and sort by visit count
      const result: ClientVisit[] = Array.from(clientsMap.entries()).map(([phoneNumber, data]) => ({
        phoneNumber,
        clientName: data.name,
        visitCount: data.visits.length,
        lastVisit: data.lastVisit
      }));
      
      return result.sort((a, b) => b.visitCount - a.visitCount);
    } catch (localError) {
      console.error('Error calculating client frequency from localStorage:', localError);
      return [];
    }
  }
};

// Metrics Functions
export const getDailyMetrics = async (date: Date = new Date()): Promise<DailyMetrics> => {
  try {
    // Set time to beginning of day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    // Set time to end of day
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase.rpc('get_metrics', {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    });
    
    if (error) throw error;
    
    const metrics = data[0];
    
    // Get dry cleaning items for the day
    const { data: dryCleaningData, error: dryCleaningError } = await supabase
      .from('dry_cleaning_items')
      .select('name, quantity')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    if (dryCleaningError) throw dryCleaningError;
    
    // Calculate dry cleaning items distribution
    const dryCleaningItems: Record<string, number> = {};
    dryCleaningData.forEach((item: any) => {
      const itemName = item.name;
      if (dryCleaningItems[itemName]) {
        dryCleaningItems[itemName] += item.quantity;
      } else {
        dryCleaningItems[itemName] = item.quantity;
      }
    });
    
    return {
      totalSales: metrics.total_sales || 0,
      valetCount: metrics.total_valets || 0,
      paymentMethods: {
        cash: metrics.cash_payments || 0,
        debit: metrics.debit_payments || 0,
        mercadopago: metrics.mercadopago_payments || 0,
        cuentaDni: metrics.cuentadni_payments || 0
      },
      dryCleaningItems
    };
  } catch (error) {
    console.error('Error retrieving daily metrics from Supabase:', error);
    
    // Fallback calculation using localStorage
    try {
      // Get start and end of the day
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      // Get tickets for the day
      const tickets = await getStoredTickets(startDate, endDate);
      
      // Calculate totals
      let totalSales = 0;
      let valetCount = 0;
      const paymentMethods = { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 };
      const dryCleaningItems: Record<string, number> = {};
      
      tickets.forEach(ticket => {
        totalSales += ticket.totalPrice || 0;
        valetCount += ticket.valetQuantity || 0;
        
        // Payment methods
        if (ticket.paymentMethod === 'cash') paymentMethods.cash += ticket.totalPrice || 0;
        if (ticket.paymentMethod === 'debit') paymentMethods.debit += ticket.totalPrice || 0;
        if (ticket.paymentMethod === 'mercado_pago') paymentMethods.mercadopago += ticket.totalPrice || 0;
        if (ticket.paymentMethod === 'cuenta_dni') paymentMethods.cuentaDni += ticket.totalPrice || 0;
        
        // Dry cleaning items
        if (ticket.dryCleaningItems && Array.isArray(ticket.dryCleaningItems)) {
          ticket.dryCleaningItems.forEach((item: any) => {
            const itemName = item.name;
            if (dryCleaningItems[itemName]) {
              dryCleaningItems[itemName] += item.quantity;
            } else {
              dryCleaningItems[itemName] = item.quantity;
            }
          });
        }
      });
      
      return {
        totalSales,
        valetCount,
        paymentMethods,
        dryCleaningItems
      };
    } catch (localError) {
      console.error('Error calculating daily metrics from localStorage:', localError);
      return {
        totalSales: 0,
        valetCount: 0,
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {}
      };
    }
  }
};

export const getWeeklyMetrics = async (date: Date = new Date()): Promise<WeeklyMetrics> => {
  try {
    // Get start of week (Sunday)
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());
    startDate.setHours(0, 0, 0, 0);
    
    // Get end of week (Saturday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    // Get all tickets for the week
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('tickets')
      .select('date, total, valet_quantity, payment_method')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString());
    
    if (ticketsError) throw ticketsError;
    
    // Get dry cleaning items for the week
    const { data: dryCleaningData, error: dryCleaningError } = await supabase
      .from('dry_cleaning_items')
      .select('name, quantity, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    if (dryCleaningError) throw dryCleaningError;
    
    // Initialize data structures
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const salesByDay: Record<string, number> = {};
    const valetsByDay: Record<string, number> = {};
    dayNames.forEach(day => {
      salesByDay[day] = 0;
      valetsByDay[day] = 0;
    });
    
    const paymentMethods = { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 };
    const dryCleaningItems: Record<string, number> = {};
    
    // Process tickets data
    ticketsData.forEach((ticket: any) => {
      const ticketDate = new Date(ticket.date);
      const dayName = dayNames[ticketDate.getDay()];
      
      salesByDay[dayName] += ticket.total || 0;
      valetsByDay[dayName] += ticket.valet_quantity || 0;
      
      // Payment methods
      if (ticket.payment_method === 'cash') paymentMethods.cash += ticket.total || 0;
      if (ticket.payment_method === 'debit') paymentMethods.debit += ticket.total || 0;
      if (ticket.payment_method === 'mercado_pago') paymentMethods.mercadopago += ticket.total || 0;
      if (ticket.payment_method === 'cuenta_dni') paymentMethods.cuentaDni += ticket.total || 0;
    });
    
    // Process dry cleaning items
    dryCleaningData.forEach((item: any) => {
      const itemName = item.name;
      if (dryCleaningItems[itemName]) {
        dryCleaningItems[itemName] += item.quantity;
      } else {
        dryCleaningItems[itemName] = item.quantity;
      }
    });
    
    return {
      salesByDay,
      valetsByDay,
      paymentMethods,
      dryCleaningItems
    };
  } catch (error) {
    console.error('Error retrieving weekly metrics from Supabase:', error);
    
    // Fallback calculation using localStorage
    try {
      // Get start of week (Sunday)
      const startDate = new Date(date);
      startDate.setDate(date.getDate() - date.getDay());
      startDate.setHours(0, 0, 0, 0);
      
      // Get end of week (Saturday)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      
      // Get tickets for the week
      const tickets = await getStoredTickets(startDate, endDate);
      
      // Initialize data structures
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const salesByDay: Record<string, number> = {};
      const valetsByDay: Record<string, number> = {};
      dayNames.forEach(day => {
        salesByDay[day] = 0;
        valetsByDay[day] = 0;
      });
      
      const paymentMethods = { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 };
      const dryCleaningItems: Record<string, number> = {};
      
      // Process tickets
      tickets.forEach(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        const dayName = dayNames[ticketDate.getDay()];
        
        salesByDay[dayName] += ticket.totalPrice || 0;
        valetsByDay[dayName] += ticket.valetQuantity || 0;
        
        // Payment methods
        if (ticket.paymentMethod === 'cash') paymentMethods.cash += ticket.totalPrice || 0;
        if (ticket.paymentMethod === 'debit') paymentMethods.debit += ticket.totalPrice || 0;
        if (ticket.paymentMethod === 'mercado_pago') paymentMethods.mercadopago += ticket.totalPrice || 0;
        if (ticket.paymentMethod === 'cuenta_dni') paymentMethods.cuentaDni += ticket.totalPrice || 0;
        
        // Dry cleaning items
        if (ticket.dryCleaningItems && Array.isArray(ticket.dryCleaningItems)) {
          ticket.dryCleaningItems.forEach((item: any) => {
            const itemName = item.name;
            if (dryCleaningItems[itemName]) {
              dryCleaningItems[itemName] += item.quantity;
            } else {
              dryCleaningItems[itemName] = item.quantity;
            }
          });
        }
      });
      
      return {
        salesByDay,
        valetsByDay,
        paymentMethods,
        dryCleaningItems
      };
    } catch (localError) {
      console.error('Error calculating weekly metrics from localStorage:', localError);
      return {
        salesByDay: {},
        valetsByDay: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {}
      };
    }
  }
};

export const getMonthlyMetrics = async (date: Date = new Date()): Promise<MonthlyMetrics> => {
  try {
    // Get start of month
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    
    // Get end of month
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Get all tickets for the month
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('tickets')
      .select('date, total, valet_quantity, payment_method')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString());
    
    if (ticketsError) throw ticketsError;
    
    // Get dry cleaning items for the month
    const { data: dryCleaningData, error: dryCleaningError } = await supabase
      .from('dry_cleaning_items')
      .select('name, quantity')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    if (dryCleaningError) throw dryCleaningError;
    
    // Initialize data structures
    const salesByWeek: Record<string, number> = {
      'Week 1': 0,
      'Week 2': 0,
      'Week 3': 0,
      'Week 4': 0,
      'Week 5': 0
    };
    
    const valetsByWeek: Record<string, number> = {
      'Week 1': 0,
      'Week 2': 0,
      'Week 3': 0,
      'Week 4': 0,
      'Week 5': 0
    };
    
    const paymentMethods = { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 };
    const dryCleaningItems: Record<string, number> = {};
    
    // Process tickets data
    ticketsData.forEach((ticket: any) => {
      const ticketDate = new Date(ticket.date);
      const weekOfMonth = Math.ceil((ticketDate.getDate()) / 7);
      const weekName = `Week ${weekOfMonth}`;
      
      salesByWeek[weekName] = (salesByWeek[weekName] || 0) + (ticket.total || 0);
      valetsByWeek[weekName] = (valetsByWeek[weekName] || 0) + (ticket.valet_quantity || 0);
      
      // Payment methods
      if (ticket.payment_method === 'cash') paymentMethods.cash += ticket.total || 0;
      if (ticket.payment_method === 'debit') paymentMethods.debit += ticket.total || 0;
      if (ticket.payment_method === 'mercado_pago') paymentMethods.mercadopago += ticket.total || 0;
      if (ticket.payment_method === 'cuenta_dni') paymentMethods.cuentaDni += ticket.total || 0;
    });
    
    // Process dry cleaning items
    dryCleaningData.forEach((item: any) => {
      const itemName = item.name;
      if (dryCleaningItems[itemName]) {
        dryCleaningItems[itemName] += item.quantity;
      } else {
        dryCleaningItems[itemName] = item.quantity;
      }
    });
    
    return {
      salesByWeek,
      valetsByWeek,
      paymentMethods,
      dryCleaningItems
    };
  } catch (error) {
    console.error('Error retrieving monthly metrics from Supabase:', error);
    
    // Fallback calculation using localStorage
    try {
      // Get start of month
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      
      // Get end of month
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      // Get tickets for the month
      const tickets = await getStoredTickets(startDate, endDate);
      
      // Initialize data structures
      const salesByWeek: Record<string, number> = {
        'Week 1': 0,
        'Week 2': 0,
        'Week 3': 0,
        'Week 4': 0,
        'Week 5': 0
      };
      
      const valetsByWeek: Record<string, number> = {
        'Week 1': 0,
        'Week 2': 0,
        'Week 3': 0,
        'Week 4': 0,
        'Week 5': 0
      };
      
      const paymentMethods = { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 };
      const dryCleaningItems: Record<string, number> = {};
      
      // Process tickets
      tickets.forEach(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        const weekOfMonth = Math.ceil((ticketDate.getDate()) / 7);
        const weekName = `Week ${weekOfMonth}`;
        
        salesByWeek[weekName] = (salesByWeek[weekName] || 0) + (ticket.totalPrice || 0);
        valetsByWeek[weekName] = (valetsByWeek[weekName] || 0) + (ticket.valetQuantity || 0);
        
        // Payment methods
        if (ticket.paymentMethod === 'cash') paymentMethods.cash += ticket.totalPrice || 0;
        if (ticket.paymentMethod === 'debit') paymentMethods.debit += ticket.totalPrice || 0;
        if (ticket.paymentMethod === 'mercado_pago') paymentMethods.mercadopago += ticket.totalPrice || 0;
        if (ticket.paymentMethod === 'cuenta_dni') paymentMethods.cuentaDni += ticket.totalPrice || 0;
        
        // Dry cleaning items
        if (ticket.dryCleaningItems && Array.isArray(ticket.dryCleaningItems)) {
          ticket.dryCleaningItems.forEach((item: any) => {
            const itemName = item.name;
            if (dryCleaningItems[itemName]) {
              dryCleaningItems[itemName] += item.quantity;
            } else {
              dryCleaningItems[itemName] = item.quantity;
            }
          });
        }
      });
      
      return {
        salesByWeek,
        valetsByWeek,
        paymentMethods,
        dryCleaningItems
      };
    } catch (localError) {
      console.error('Error calculating monthly metrics from localStorage:', localError);
      return {
        salesByWeek: {},
        valetsByWeek: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {}
      };
    }
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
