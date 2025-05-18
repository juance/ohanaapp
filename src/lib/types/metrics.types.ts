
// Basic metrics interfaces
export interface DailyMetrics {
  date: string;
  revenue: number;
  tickets: number;
  clients: number;
}

export interface WeeklyMetrics {
  week: string;
  revenue: number;
  tickets: number;
  clients: number;
}

export interface MonthlyMetrics {
  month: string;
  revenue: number;
  tickets: number;
  clients: number;
}

export interface MetricsData {
  daily: DailyMetrics[];
  weekly: WeeklyMetrics[];
  monthly: MonthlyMetrics[];
  totalRevenue: number;
  totalTickets: number;
  totalClients: number;
}
