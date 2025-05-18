
// Define types for metrics data

export interface DailyMetrics {
  date: string;
  ticketsCount: number;
  revenue: number;
  averageTicketValue: number;
  salesByHour: { hour: number; count: number; revenue: number }[];
  paidTickets?: number; // Added missing property
  
  // Legacy properties for backward compatibility
  totalSales?: number;
  valetCount?: number;
  paymentMethods?: Record<string, number>;
  totalRevenue?: number;
  totalTickets?: number;
  dryCleaningItems?: Record<string, number>;
}

export interface WeeklyMetrics {
  weekStartDate: string;
  weekEndDate: string;
  ticketsCount: number;
  revenue: number;
  averageTicketValue: number;
  salesByDay: { day: string; count: number; revenue: number }[];
  salesByWeek?: { week: string; count: number; revenue: number }[]; // Added missing property
  
  // Legacy properties for backward compatibility
  totalSales?: number;
  valetCount?: number;
  paymentMethods?: Record<string, number>;
  totalRevenue?: number;
  totalTickets?: number;
  dryCleaningItems?: Record<string, number>;
}

export interface MonthlyMetrics {
  month: string;
  year: number;
  ticketsCount: number;
  revenue: number;
  averageTicketValue: number;
  salesByDay: { day: number; count: number; revenue: number }[];
  paidTickets?: number; // Added missing property
  
  // Legacy properties for backward compatibility
  totalSales?: number;
  valetCount?: number;
  paymentMethods?: Record<string, number>;
  totalRevenue?: number;
  totalTickets?: number;
  dryCleaningItems?: Record<string, number>;
}

export interface MetricsData {
  daily: DailyMetrics[];
  weekly: WeeklyMetrics[];
  monthly: MonthlyMetrics[];
}
