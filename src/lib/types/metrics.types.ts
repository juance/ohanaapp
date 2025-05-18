
export interface DailyMetrics {
  date: string;
  totalSales: number;
  ticketCount: number;
  averageTicketValue: number;
  valetCount: number;
  dryCleaningCount: number;
}

export interface WeeklyMetrics {
  weekStartDate: string;
  weekEndDate: string;
  totalSales: number;
  ticketCount: number;
  averageTicketValue: number;
  topSellingServices: Array<{name: string, count: number}>;
}

export interface MonthlyMetrics {
  month: string;
  year: number;
  totalSales: number;
  totalExpenses: number;
  profit: number;
  ticketCount: number;
  customerCount: number;
  repeatCustomerRate: number;
}
