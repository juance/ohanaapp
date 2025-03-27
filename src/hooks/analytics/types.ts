
// Export types for analytics
export interface TicketAnalytics {
  totalTickets: number;
  averageTicketValue: number;
  totalRevenue: number;
  ticketsByStatus?: {
    pending: number;
    processing: number;
    ready: number;
    delivered: number;
  };
  topServices: Array<{ name: string; count: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  itemTypeDistribution: Record<string, number>;
  paymentMethodDistribution: Record<string, number>;
  freeValets?: number;
  paidTickets?: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

// Export with a renamed type alias
export type { DateRange as AnalyticsDateRange };

export interface UseTicketAnalyticsReturn {
  data: TicketAnalytics;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  isLoading: boolean;
  error: Error | null;
  exportData: () => Promise<void>;
}
