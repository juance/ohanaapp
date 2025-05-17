
// Define interfaces for analytics data structures
export interface TicketAnalytics {
  totalTickets: number;
  averageTicketValue: number;
  totalRevenue: number;
  itemTypeDistribution: Record<string, number>;
  paymentMethodDistribution: Record<string, number>;
  ticketsByStatus?: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsFilter {
  dateRange?: DateRange;
  customerId?: string;
  paymentMethod?: string;
  status?: string;
}
