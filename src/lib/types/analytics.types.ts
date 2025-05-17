
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
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ClientVisit {
  clientId: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisit: Date;
}

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
