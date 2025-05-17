
export interface DateRange {
  from: Date;
  to: Date;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
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
