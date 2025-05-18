
export interface DailyMetrics {
  salesByHour: Record<string, number>;
  paymentMethods: { 
    cash: number; 
    debit: number; 
    mercadopago: number; 
    cuentaDni: number;
    transfer?: number; 
  };
  totalSales: number;
  valetCount: number;
  dryCleaningItems?: Record<string, number>;
  paidTickets?: number;
}

export interface WeeklyMetrics {
  salesByDay: Record<string, number>;
  salesByWeek?: Record<string, number>; // For backward compatibility
  paymentMethods: { 
    cash: number; 
    debit: number; 
    mercadopago: number; 
    cuentaDni: number;
    transfer?: number; 
  };
  totalSales: number;
  valetCount: number;
  paidTickets?: number;
}

export interface MonthlyMetrics {
  salesByDay: Record<string, number>;
  paymentMethods: { 
    cash: number; 
    debit: number; 
    mercadopago: number; 
    cuentaDni: number;
    transfer?: number; 
  };
  totalSales: number;
  valetCount: number;
  paidTickets?: number;
}

export interface MetricsData {
  daily?: DailyMetrics;
  weekly?: WeeklyMetrics;
  monthly?: MonthlyMetrics;
}
