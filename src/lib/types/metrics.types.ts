
export interface DailyMetrics {
  totalSales: number;
  salesByHour: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  dryCleaningItems: Record<string, number>; 
  valetCount: number;
  ticketsCount?: number;
  revenue?: number;
  totalRevenue?: number;
  totalTickets?: number;
  averageTicketValue?: number;
}

export interface WeeklyMetrics {
  totalSales: number;
  salesByDay: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  dryCleaningItems: Record<string, number>; 
  valetCount: number;
  ticketsCount?: number;
  revenue?: number;
  totalRevenue?: number;
  totalTickets?: number;
  averageTicketValue?: number;
  weekStartDate?: string;
  weekEndDate?: string;
}

export interface MonthlyMetrics {
  totalSales: number;
  salesByWeek: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  dryCleaningItems: Record<string, number>; 
  valetCount: number;
  ticketsCount?: number;
  revenue?: number;
  totalRevenue?: number;
  totalTickets?: number;
  averageTicketValue?: number;
  month?: string;
  year?: number;
  salesByDay?: Record<string, number>;
}
