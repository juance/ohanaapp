
import { TicketAnalytics } from '@/lib/analytics/interfaces';
import { format } from 'date-fns';

/**
 * Processes raw ticket data into analytics format
 * @param tickets Raw ticket data from Supabase
 * @param dryCleaningItems Dry cleaning items data from Supabase
 * @returns Processed analytics data
 */
export const processTicketAnalyticsData = (tickets: any[], dryCleaningItems: any[], newCustomers: any[] = []): TicketAnalytics => {
  // Prepare the analytics object with default values
  const analytics: TicketAnalytics = {
    totalTickets: tickets.length,
    totalRevenue: 0,
    averageTicketValue: 0,
    ticketsByStatus: {
      pending: 0,
      processing: 0,
      ready: 0,
      delivered: 0
    },
    revenueByMonth: [],
    itemTypeDistribution: {},
    paymentMethodDistribution: {},
    freeValets: 0,
    paidTickets: 0,
    newCustomers: newCustomers.length
  };
  
  // Initialize objects to track distributions
  const revenueByMonthMap: Record<string, number> = {};
  
  // Process each ticket
  tickets.forEach(ticket => {
    // Add to total revenue
    analytics.totalRevenue += Number(ticket.total || 0);
    
    // Increment ticket status count
    if (ticket.status && analytics.ticketsByStatus) {
      const status = ticket.status as keyof typeof analytics.ticketsByStatus;
      analytics.ticketsByStatus[status] = (analytics.ticketsByStatus[status] || 0) + 1;
    }
    
    // Track payment methods
    if (ticket.payment_method) {
      analytics.paymentMethodDistribution[ticket.payment_method] = 
        (analytics.paymentMethodDistribution[ticket.payment_method] || 0) + 1;
    }
    
    // Track paid tickets
    if (ticket.is_paid) {
      analytics.paidTickets = (analytics.paidTickets || 0) + 1;
    }
    
    // Track free valets from ticket customers
    if (ticket.customers?.free_valets) {
      analytics.freeValets = (analytics.freeValets || 0) + ticket.customers.free_valets;
    }
    
    // Add to revenue by month
    const month = format(new Date(ticket.created_at), 'yyyy-MM');
    revenueByMonthMap[month] = (revenueByMonthMap[month] || 0) + Number(ticket.total || 0);
  });
  
  // Process dry cleaning items
  dryCleaningItems.forEach(item => {
    // Track item type distribution
    if (item.name) {
      analytics.itemTypeDistribution[item.name] = 
        (analytics.itemTypeDistribution[item.name] || 0) + Number(item.quantity || 1);
    }
  });
  
  // Calculate average ticket value
  analytics.averageTicketValue = analytics.totalTickets > 0 
    ? analytics.totalRevenue / analytics.totalTickets 
    : 0;
  
  // Convert revenue by month map to array format
  analytics.revenueByMonth = Object.entries(revenueByMonthMap).map(([month, revenue]) => ({
    month,
    revenue
  })).sort((a, b) => a.month.localeCompare(b.month));
  
  return analytics;
};
