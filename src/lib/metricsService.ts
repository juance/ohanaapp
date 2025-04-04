import { supabase } from '@/integrations/supabase/client';
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from './types';
import { getStoredTickets } from './dataService';

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
