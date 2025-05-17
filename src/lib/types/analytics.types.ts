
export interface DateRange {
  from: Date;
  to: Date;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
}

// Add the missing chart data types
export interface ChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  name: string;
  income: number;
  expenses: number;
}

export interface BarChartData {
  name: string;
  total: number;
}

export interface TicketAnalytics {
  totalTickets: number;
  totalRevenue: number;
  averageTicketValue: number;
  ticketsByStatus: {
    ready: number;
    delivered: number;
    pending: number;
  };
  paymentMethodDistribution: Record<string, number>;
  itemTypeDistribution: Record<string, number>;
  revenueByMonth: RevenueByMonth[];
}
