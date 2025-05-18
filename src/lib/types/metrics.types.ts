
// Create this file if it doesn't exist
export interface DailyMetrics {
  totalSales: number;
  salesByHour: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  dryCleaningItems: Record<string, number>; // Added this property
  valetCount: number;
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
  dryCleaningItems: Record<string, number>; // Added this property
  valetCount: number;
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
  dryCleaningItems: Record<string, number>; // Added this property
  valetCount: number;
}
