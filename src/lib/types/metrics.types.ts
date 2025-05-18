
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
}

export interface WeeklyMetrics {
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
}

export interface MetricsData {
  daily?: DailyMetrics;
  weekly?: WeeklyMetrics;
  monthly?: MonthlyMetrics;
}
