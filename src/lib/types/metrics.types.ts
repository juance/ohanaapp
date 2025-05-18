
export interface DailyMetrics {
  date: string;
  total: number;
  count: number;
  valetsCount: number;
  dryCleaningCount: number;
  totalValets: number;
  totalDryCleaning: number;
  valetPercentage: number;
  dryCleaningPercentage: number;
  salesByDay: { day: string; total: number }[];
}

export interface WeeklyMetrics {
  startDate: string;
  endDate: string;
  total: number;
  count: number;
  valetsCount: number;
  dryCleaningCount: number;
  totalValets: number;
  totalDryCleaning: number;
  valetPercentage: number;
  dryCleaningPercentage: number;
  salesByDay: { day: string; total: number }[];
}

export interface MonthlyMetrics {
  month: string;
  year: number;
  total: number;
  count: number;
  valetsCount: number;
  dryCleaningCount: number;
  totalValets: number;
  totalDryCleaning: number;
  valetPercentage: number;
  dryCleaningPercentage: number;
  salesByDay: { day: string; total: number }[];
  salesByWeek: { week: string; total: number }[];
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  loyaltyProgram: number;
}

export interface MetricsResponse {
  daily: DailyMetrics;
  weekly: WeeklyMetrics;
  monthly: MonthlyMetrics;
  customers: CustomerMetrics;
}
