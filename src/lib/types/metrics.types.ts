
// Define types for metrics data

export interface DailyMetrics {
  date: string;
  ticketsCount: number;
  revenue: number;
  averageTicketValue: number;
  salesByHour: { hour: number; count: number; revenue: number }[];
  paidTickets?: number; // Added missing property
}

export interface WeeklyMetrics {
  weekStartDate: string;
  weekEndDate: string;
  ticketsCount: number;
  revenue: number;
  averageTicketValue: number;
  salesByDay: { day: string; count: number; revenue: number }[];
  salesByWeek?: { week: string; count: number; revenue: number }[]; // Added missing property
}

export interface MonthlyMetrics {
  month: string;
  year: number;
  ticketsCount: number;
  revenue: number;
  averageTicketValue: number;
  salesByDay: { day: number; count: number; revenue: number }[];
  paidTickets?: number; // Added missing property
}

export interface MetricsData {
  daily: DailyMetrics[];
  weekly: WeeklyMetrics[];
  monthly: MonthlyMetrics[];
}
