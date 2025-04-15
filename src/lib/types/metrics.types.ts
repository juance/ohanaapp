
export interface DailyMetrics {
  totalTickets: number;
  paidTickets: number;
  totalRevenue: number;
  salesByHour: Record<string, number>;
  dryCleaningItems: Record<string, number>;
  paymentMethods?: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  totalSales: number;
  valetCount: number;
}

export interface WeeklyMetrics {
  totalTickets: number;
  paidTickets: number;
  totalRevenue: number;
  salesByDay: Record<string, number>;
  dryCleaningItems: Record<string, number>;
  paymentMethods?: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  totalSales: number;
  valetCount: number;
}

export interface MonthlyMetrics {
  totalTickets: number;
  paidTickets: number;
  totalRevenue: number;
  salesByWeek: Record<string, number>;
  salesByDay: Record<string, number>;
  dryCleaningItems: Record<string, number>;
  paymentMethods?: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  totalSales: number;
  valetCount: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  expenses: number;
  netRevenue: number;
  newCustomers: number;
  ticketsCreated: number;
  averageRating: number;
}
