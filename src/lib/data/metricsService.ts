
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '../types';

// Mock data structure for tracking metrics
let dailyMetrics: DailyMetrics = {
  salesByHour: {},
  paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
  dryCleaningItems: {},
  totalSales: 0,
  valetCount: 0
};

let weeklyMetrics: WeeklyMetrics = {
  salesByDay: {},
  valetsByDay: {},
  paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
  dryCleaningItems: {},
  totalSales: 0,
  valetCount: 0
};

let monthlyMetrics: MonthlyMetrics = {
  salesByDay: {},
  salesByWeek: {},
  paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
  dryCleaningItems: {},
  totalSales: 0,
  valetCount: 0
};

// Initialize metrics
export const initializeMetrics = () => {
  console.log('Initializing metrics...');
  
  // Initialize daily metrics
  dailyMetrics = {
    salesByHour: {},
    paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
    dryCleaningItems: {},
    totalSales: 0,
    valetCount: 0
  };
  
  // Initialize weekly metrics
  weeklyMetrics = {
    salesByDay: {},
    valetsByDay: {},
    paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
    dryCleaningItems: {},
    totalSales: 0,
    valetCount: 0
  };
  
  // Initialize monthly metrics
  monthlyMetrics = {
    salesByDay: {},
    salesByWeek: {},
    paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
    dryCleaningItems: {},
    totalSales: 0,
    valetCount: 0
  };
};

// Update metrics when a new ticket is created
export const updateMetrics = (type: string, data: any) => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDate();
  const week = Math.ceil(day / 7);
  
  // Update daily metrics
  if (!dailyMetrics.salesByHour[hour]) {
    dailyMetrics.salesByHour[hour] = 0;
  }
  dailyMetrics.salesByHour[hour] += data.amount || 0;
  dailyMetrics.totalSales += data.amount || 0;
  if (type === 'valet') {
    dailyMetrics.valetCount += data.quantity || 1;
  }
  
  // Update payment method counts
  if (data.paymentMethod) {
    dailyMetrics.paymentMethods[data.paymentMethod] += data.amount || 0;
  }
  
  // Update weekly metrics
  if (!weeklyMetrics.salesByDay[day]) {
    weeklyMetrics.salesByDay[day] = 0;
  }
  weeklyMetrics.salesByDay[day] += data.amount || 0;
  
  if (!weeklyMetrics.valetsByDay[day]) {
    weeklyMetrics.valetsByDay[day] = 0;
  }
  if (type === 'valet') {
    weeklyMetrics.valetsByDay[day] += data.quantity || 1;
  }
  
  weeklyMetrics.totalSales += data.amount || 0;
  weeklyMetrics.valetCount += type === 'valet' ? (data.quantity || 1) : 0;
  
  if (data.paymentMethod) {
    weeklyMetrics.paymentMethods[data.paymentMethod] += data.amount || 0;
  }
  
  // Update monthly metrics
  if (!monthlyMetrics.salesByDay[day]) {
    monthlyMetrics.salesByDay[day] = 0;
  }
  monthlyMetrics.salesByDay[day] += data.amount || 0;
  
  if (!monthlyMetrics.salesByWeek[week]) {
    monthlyMetrics.salesByWeek[week] = 0;
  }
  monthlyMetrics.salesByWeek[week] += data.amount || 0;
  
  monthlyMetrics.totalSales += data.amount || 0;
  monthlyMetrics.valetCount += type === 'valet' ? (data.quantity || 1) : 0;
  
  if (data.paymentMethod) {
    monthlyMetrics.paymentMethods[data.paymentMethod] += data.amount || 0;
  }
};

// Get the current metrics
export const getMetrics = () => {
  return {
    daily: dailyMetrics,
    weekly: weeklyMetrics,
    monthly: monthlyMetrics
  };
};

// Reset all metrics
export const resetMetrics = () => {
  initializeMetrics();
};

// Update dashboard metrics when a new ticket is created
export const updateDashboardMetrics = (data: any) => {
  try {
    const ticketType = data.ticketType || 'valet';
    const total = data.total || 0;
    
    // Update metrics for the new ticket
    updateMetrics(ticketType, {
      amount: total,
      paymentMethod: data.paymentMethod || 'cash',
      quantity: data.valetQuantity || 1
    });
    
    return true;
  } catch (error) {
    console.error('Error updating dashboard metrics:', error);
    return false;
  }
};

// Initialize metrics on app start
initializeMetrics();
