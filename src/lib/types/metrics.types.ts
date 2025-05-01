
// Types for analytics metrics

export interface DailyMetrics {
  totalTickets: number;
  totalSales: number;
  totalRevenue: number;
  paidTickets: number;
  salesByHour: Record<number, number>;
  dryCleaningItems: Record<string, number>;
  valetCount: number;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
    [key: string]: number;
  };
}

export interface WeeklyMetrics {
  totalTickets: number;
  totalSales: number;
  totalRevenue: number;
  paidTickets: number;
  salesByDay: Record<number, number>;
  dryCleaningItems: Record<string, number>;
  valetCount: number;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
    [key: string]: number;
  };
}

export interface MonthlyMetrics {
  totalTickets: number;
  totalSales: number;
  totalRevenue: number;
  paidTickets: number;
  salesByWeek: Record<number, number>;
  salesByDay: Record<number, number>;
  dryCleaningItems: Record<string, number>;
  valetCount: number;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
    [key: string]: number;
  };
}
