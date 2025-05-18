
export interface BaseMetrics {
  totalRevenue: number;
  ticketCount: number;
  averageTicketValue: number;
  valetCount: number;
  dryCleaningCount: number;
}

export interface DailyMetrics extends BaseMetrics {
  date: string;
}

export interface WeeklyMetrics extends BaseMetrics {
  weekStart: string;
  weekEnd: string;
}

export interface MonthlyMetrics extends BaseMetrics {
  month: string;
  year: number;
}
