
export interface TicketAnalytics {
  totalTickets: number;
  averageTicketValue: number;
  totalRevenue: number;
  ticketsByStatus: {
    pending: number;
    processing: number;
    ready: number;
    delivered: number;
  };
  topServices: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  itemTypeDistribution: Record<string, number>;
  paymentMethodDistribution: Record<string, number>;
  freeValets: number;
  paidTickets: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type DateFilterType = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
