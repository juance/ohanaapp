
// Metrics types

export interface DailyMetrics {
  salesByHour: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  dryCleaningItems: Record<string, number>;
  totalSales: number;
  valetCount: number;
  paidTickets?: number;
  totalRevenue?: number;
}

export interface WeeklyMetrics {
  salesByDay: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  totalSales: number;
  valetCount: number;
  paidTickets?: number;
  totalRevenue?: number;
}

export interface MonthlyMetrics {
  salesByDay: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  totalSales: number;
  valetCount: number;
  paidTickets?: number;
  totalRevenue?: number;
}
