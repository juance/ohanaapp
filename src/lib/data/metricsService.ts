// Import necessary types
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types/metrics.types';

export const getDefaultWeeklyMetrics = (): WeeklyMetrics => {
  return {
    salesByDay: {},
    salesByWeek: {},
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

export const getDefaultDailyMetrics = (): DailyMetrics => {
  return {
    salesByHour: {},
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
    salesByDay: {},
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

export const calculateDailyMetrics = (tickets: any[]): DailyMetrics => {
  const metrics: DailyMetrics = {
    salesByHour: {},
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

    metrics.salesByHour[hour] = (metrics.salesByHour[hour] || 0) + ticket.total;
    metrics.totalSales += ticket.total;
    metrics.valetCount += ticket.valetQuantity || 0;

    metrics.paymentMethods[paymentMethod] = (metrics.paymentMethods[paymentMethod] || 0) + ticket.total;
    metrics.totalRevenue += ticket.total;
    metrics.totalTickets++;
  });

  return metrics;
};

export const calculateWeeklyMetrics = (tickets: any[]): WeeklyMetrics => {
  const metrics: WeeklyMetrics = {
    salesByDay: {},
    salesByWeek: {},
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
    const day = new Date(ticket.date).toLocaleDateString('es-AR', { weekday: 'short' });
    const paymentMethod = ticket.paymentMethod;

    metrics.salesByDay[day] = (metrics.salesByDay[day] || 0) + ticket.total;
    metrics.totalSales += ticket.total;
    metrics.valetCount += ticket.valetQuantity || 0;

    metrics.paymentMethods[paymentMethod] = (metrics.paymentMethods[paymentMethod] || 0) + ticket.total;
    metrics.totalRevenue += ticket.total;
    metrics.totalTickets++;
  });

  return metrics;
};

export const calculateMonthlyMetrics = (tickets: any[]): MonthlyMetrics => {
  const metrics: MonthlyMetrics = {
    salesByDay: {},
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
    const day = new Date(ticket.date).toLocaleDateString('es-AR', { day: 'numeric' });
    const paymentMethod = ticket.paymentMethod;

    metrics.salesByDay[day] = (metrics.salesByDay[day] || 0) + ticket.total;
    metrics.totalSales += ticket.total;
    metrics.valetCount += ticket.valetQuantity || 0;

    metrics.paymentMethods[paymentMethod] = (metrics.paymentMethods[paymentMethod] || 0) + ticket.total;
    metrics.totalRevenue += ticket.total;
    metrics.totalTickets++;
  });

  return metrics;
};
