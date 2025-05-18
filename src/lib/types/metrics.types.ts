
// Types for dashboard metrics

export interface DailyMetrics {
  date: string;
  totalSales: number;
  ticketCount: number;
  expenses?: number;
  profit?: number;
}

export interface WeeklyMetrics {
  weekStart: string;
  weekEnd: string;
  totalSales: number;
  ticketCount: number;
  expenses?: number;
  profit?: number;
  dailyMetrics?: DailyMetrics[];
}

export interface MonthlyMetrics {
  month: string;
  year: number;
  totalSales: number;
  ticketCount: number;
  expenses?: number;
  profit?: number;
  weeklyMetrics?: WeeklyMetrics[];
}

export interface DashboardMetrics {
  dailyMetrics: DailyMetrics[];
  weeklyMetrics: WeeklyMetrics[];
  monthlyMetrics: MonthlyMetrics[];
  topClients?: {
    clientName: string;
    totalSpent: number;
    visitCount: number;
  }[];
}
