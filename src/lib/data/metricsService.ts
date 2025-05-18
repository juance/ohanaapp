
// Import necessary types
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types/metrics.types';

export const getDefaultWeeklyMetrics = (): WeeklyMetrics => {
  return {
    weekStartDate: "",
    weekEndDate: "",
    ticketsCount: 0,
    revenue: 0,
    averageTicketValue: 0,
    salesByDay: [],
    salesByWeek: [],
    // Legacy fields
    totalSales: 0,
    valetCount: 0,
    paymentMethods: {
      cash: 0,
      debit: 0,
      mercadopago: 0,
      cuentaDni: 0
    },
    totalRevenue: 0,
    totalTickets: 0,
    dryCleaningItems: {}
  };
};

export const getDefaultDailyMetrics = (): DailyMetrics => {
  return {
    date: "",
    ticketsCount: 0,
    revenue: 0,
    averageTicketValue: 0,
    salesByHour: [],
    // Legacy fields
    totalSales: 0,
    valetCount: 0,
    paymentMethods: {
      cash: 0,
      debit: 0,
      mercadopago: 0,
      cuentaDni: 0
    },
    paidTickets: 0,
    totalRevenue: 0,
    totalTickets: 0,
    dryCleaningItems: {}
  };
};

export const getDefaultMonthlyMetrics = (): MonthlyMetrics => {
  return {
    month: "",
    year: 0,
    ticketsCount: 0,
    revenue: 0,
    averageTicketValue: 0,
    salesByDay: [],
    // Legacy fields
    paidTickets: 0,
    totalSales: 0,
    valetCount: 0,
    paymentMethods: {
      cash: 0,
      debit: 0,
      mercadopago: 0,
      cuentaDni: 0
    },
    totalRevenue: 0,
    totalTickets: 0,
    dryCleaningItems: {}
  };
};

export const calculateDailyMetrics = (tickets: any[]): DailyMetrics => {
  const metrics: DailyMetrics = {
    date: new Date().toISOString().split('T')[0],
    ticketsCount: 0,
    revenue: 0,
    averageTicketValue: 0,
    salesByHour: [],
    // Legacy fields
    totalSales: 0,
    valetCount: 0,
    paymentMethods: {
      cash: 0,
      debit: 0,
      mercadopago: 0,
      cuentaDni: 0
    },
    paidTickets: 0,
    totalRevenue: 0,
    totalTickets: 0,
    dryCleaningItems: {}
  };

  tickets.forEach(ticket => {
    const hour = new Date(ticket.date).getHours();
    const paymentMethod = ticket.paymentMethod;

    // Update hourly sales data
    const existingHourEntry = metrics.salesByHour.find(entry => entry.hour === hour);
    if (existingHourEntry) {
      existingHourEntry.count += 1;
      existingHourEntry.revenue += ticket.total;
    } else {
      metrics.salesByHour.push({ hour, count: 1, revenue: ticket.total });
    }

    // Legacy fields
    metrics.totalSales += ticket.total;
    metrics.valetCount += ticket.valetQuantity || 0;
    metrics.ticketsCount += 1;
    metrics.revenue += ticket.total;
    metrics.totalRevenue += ticket.total;
    metrics.totalTickets += 1;

    // Update payment methods
    if (metrics.paymentMethods && typeof metrics.paymentMethods === 'object') {
      metrics.paymentMethods[paymentMethod] = (metrics.paymentMethods[paymentMethod] || 0) + ticket.total;
    }
  });

  // Calculate average ticket value
  metrics.averageTicketValue = metrics.ticketsCount > 0 ? metrics.revenue / metrics.ticketsCount : 0;

  return metrics;
};

export const calculateWeeklyMetrics = (tickets: any[]): WeeklyMetrics => {
  const metrics: WeeklyMetrics = {
    weekStartDate: "",
    weekEndDate: "",
    ticketsCount: 0,
    revenue: 0,
    averageTicketValue: 0,
    salesByDay: [],
    salesByWeek: [],
    // Legacy fields
    totalSales: 0,
    valetCount: 0,
    paymentMethods: {
      cash: 0,
      debit: 0,
      mercadopago: 0,
      cuentaDni: 0
    },
    totalRevenue: 0,
    totalTickets: 0,
    dryCleaningItems: {}
  };

  tickets.forEach(ticket => {
    const day = new Date(ticket.date).toLocaleDateString('es-AR', { weekday: 'short' });
    const paymentMethod = ticket.paymentMethod;

    // Update daily sales data
    const existingDayEntry = metrics.salesByDay.find(entry => entry.day === day);
    if (existingDayEntry) {
      existingDayEntry.count += 1;
      existingDayEntry.revenue += ticket.total;
    } else {
      metrics.salesByDay.push({ day, count: 1, revenue: ticket.total });
    }

    // Legacy fields
    metrics.totalSales += ticket.total;
    metrics.valetCount += ticket.valetQuantity || 0;
    metrics.ticketsCount += 1;
    metrics.revenue += ticket.total;
    metrics.totalRevenue += ticket.total;
    metrics.totalTickets += 1;

    // Update payment methods
    if (metrics.paymentMethods && typeof metrics.paymentMethods === 'object') {
      metrics.paymentMethods[paymentMethod] = (metrics.paymentMethods[paymentMethod] || 0) + ticket.total;
    }
  });

  // Calculate average ticket value
  metrics.averageTicketValue = metrics.ticketsCount > 0 ? metrics.revenue / metrics.ticketsCount : 0;

  // Set week dates
  const now = new Date();
  const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
  const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  metrics.weekStartDate = firstDay.toISOString().split('T')[0];
  metrics.weekEndDate = lastDay.toISOString().split('T')[0];

  return metrics;
};

export const calculateMonthlyMetrics = (tickets: any[]): MonthlyMetrics => {
  const metrics: MonthlyMetrics = {
    month: "",
    year: 0,
    ticketsCount: 0,
    revenue: 0,
    averageTicketValue: 0,
    salesByDay: [],
    // Legacy fields
    totalSales: 0,
    valetCount: 0,
    paymentMethods: {
      cash: 0,
      debit: 0,
      mercadopago: 0,
      cuentaDni: 0
    },
    paidTickets: 0,
    totalRevenue: 0,
    totalTickets: 0,
    dryCleaningItems: {}
  };

  tickets.forEach(ticket => {
    const day = new Date(ticket.date).getDate();
    const paymentMethod = ticket.paymentMethod;

    // Update daily sales data
    const existingDayEntry = metrics.salesByDay.find(entry => entry.day === day);
    if (existingDayEntry) {
      existingDayEntry.count += 1;
      existingDayEntry.revenue += ticket.total;
    } else {
      metrics.salesByDay.push({ day, count: 1, revenue: ticket.total });
    }

    // Legacy fields
    metrics.totalSales += ticket.total;
    metrics.valetCount += ticket.valetQuantity || 0;
    metrics.ticketsCount += 1;
    metrics.revenue += ticket.total;
    metrics.totalRevenue += ticket.total;
    metrics.totalTickets += 1;

    // Update payment methods
    if (metrics.paymentMethods && typeof metrics.paymentMethods === 'object') {
      metrics.paymentMethods[paymentMethod] = (metrics.paymentMethods[paymentMethod] || 0) + ticket.total;
    }
  });

  // Calculate average ticket value
  metrics.averageTicketValue = metrics.ticketsCount > 0 ? metrics.revenue / metrics.ticketsCount : 0;

  // Set month and year
  const now = new Date();
  metrics.month = now.toLocaleDateString('es-AR', { month: 'long' });
  metrics.year = now.getFullYear();

  return metrics;
};
