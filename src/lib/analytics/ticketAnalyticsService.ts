
import { supabase } from '@/integrations/supabase/client';

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

/**
 * Fetches ticket analytics data from Supabase within the specified date range
 */
export const fetchTicketAnalytics = async (dateRange: DateRange): Promise<TicketAnalytics> => {
  try {
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        id, 
        total, 
        payment_method, 
        status, 
        date,
        is_canceled,
        is_paid,
        valet_quantity,
        dry_cleaning_items (id, name, quantity, price)
      `)
      .gte('date', dateRange.from.toISOString())
      .lte('date', dateRange.to.toISOString())
      .eq('is_canceled', false);

    if (ticketsError) throw ticketsError;

    if (!tickets || tickets.length === 0) {
      return createEmptyAnalyticsData();
    }

    // Basic metrics
    const totalTickets = tickets.length;
    const totalRevenue = tickets.reduce((sum, ticket) => sum + (Number(ticket.total) || 0), 0);
    const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;
    const freeValets = tickets.filter(ticket => ticket.valet_quantity > 0 && ticket.total === 0).length;
    const paidTickets = tickets.filter(ticket => ticket.is_paid).length;

    // Status distribution
    const ticketsByStatus = {
      pending: 0,
      processing: 0,
      ready: 0,
      delivered: 0
    };

    tickets.forEach(ticket => {
      const status = ticket.status as keyof typeof ticketsByStatus;
      if (status in ticketsByStatus) {
        ticketsByStatus[status]++;
      }
    });

    // Payment method distribution
    const paymentMethodDistribution: Record<string, number> = {};
    tickets.forEach(ticket => {
      const method = ticket.payment_method;
      paymentMethodDistribution[method] = (paymentMethodDistribution[method] || 0) + 1;
    });

    // Item type distribution
    const itemTypeDistribution: Record<string, number> = {};
    tickets.forEach(ticket => {
      if (ticket.dry_cleaning_items && Array.isArray(ticket.dry_cleaning_items)) {
        ticket.dry_cleaning_items.forEach((item: any) => {
          const itemName = item.name;
          itemTypeDistribution[itemName] = (itemTypeDistribution[itemName] || 0) + (item.quantity || 1);
        });
      }
    });

    // Top services
    const servicesMap = new Map<string, number>();
    tickets.forEach(ticket => {
      if (ticket.dry_cleaning_items && Array.isArray(ticket.dry_cleaning_items)) {
        ticket.dry_cleaning_items.forEach((item: any) => {
          servicesMap.set(item.name, (servicesMap.get(item.name) || 0) + (item.quantity || 1));
        });
      } else {
        servicesMap.set('Valet', (servicesMap.get('Valet') || 0) + 1);
      }
    });

    const topServices = Array.from(servicesMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Revenue by month
    const revenueByMonth = calculateRevenueByMonth(tickets);

    return {
      totalTickets,
      averageTicketValue,
      totalRevenue,
      ticketsByStatus,
      topServices,
      revenueByMonth,
      itemTypeDistribution,
      paymentMethodDistribution,
      freeValets,
      paidTickets
    };
  } catch (err) {
    console.error("Error fetching ticket analytics:", err);
    throw err instanceof Error ? err : new Error('Unknown error fetching analytics');
  }
};

/**
 * Creates empty analytics data structure
 */
const createEmptyAnalyticsData = (): TicketAnalytics => {
  return {
    totalTickets: 0,
    averageTicketValue: 0,
    totalRevenue: 0,
    ticketsByStatus: {
      pending: 0,
      processing: 0,
      ready: 0,
      delivered: 0
    },
    topServices: [],
    revenueByMonth: [],
    itemTypeDistribution: {},
    paymentMethodDistribution: {},
    freeValets: 0,
    paidTickets: 0
  };
};

/**
 * Calculates revenue by month from tickets
 */
const calculateRevenueByMonth = (tickets: any[]): Array<{ month: string; revenue: number }> => {
  const revenueByMonthMap = new Map<string, number>();
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  tickets.forEach(ticket => {
    if (!ticket.date) return;
    const date = new Date(ticket.date);
    const monthKey = months[date.getMonth()];
    revenueByMonthMap.set(monthKey, (revenueByMonthMap.get(monthKey) || 0) + Number(ticket.total || 0));
  });

  return Array.from(revenueByMonthMap.entries())
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => {
      const aIndex = months.indexOf(a.month);
      const bIndex = months.indexOf(b.month);
      return aIndex - bIndex;
    });
};
