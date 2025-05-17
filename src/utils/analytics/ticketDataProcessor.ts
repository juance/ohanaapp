
import { Ticket } from '@/lib/types';
import { TicketAnalytics } from '@/lib/analytics/interfaces';
import { format } from 'date-fns';

/**
 * Process ticket data for analytics visualization
 */
export const processTicketAnalyticsData = (tickets: any[], dryCleaningItems: any[] = []): TicketAnalytics => {
  // Filter out canceled tickets
  const activeTickets = tickets.filter(t => !t.is_canceled);
  
  // Calculate basic metrics
  const totalTickets = activeTickets.length;
  const totalRevenue = activeTickets.reduce((sum, ticket) => sum + (Number(ticket.total) || 0), 0);
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;
  
  // Count tickets by status
  const ticketsByStatus = {
    pending: activeTickets.filter(t => t.status === 'pending').length,
    processing: activeTickets.filter(t => t.status === 'processing').length,
    ready: activeTickets.filter(t => t.status === 'ready').length,
    delivered: activeTickets.filter(t => t.status === 'delivered').length
  };
  
  // Calculate revenue by month
  const revenueByMonthMap = new Map<string, number>();
  
  activeTickets.forEach(ticket => {
    const date = new Date(ticket.created_at);
    const monthKey = format(date, 'MMM yyyy');
    
    const currentRevenue = revenueByMonthMap.get(monthKey) || 0;
    revenueByMonthMap.set(monthKey, currentRevenue + (Number(ticket.total) || 0));
  });
  
  // Convert revenue map to array
  const revenueByMonth = Array.from(revenueByMonthMap.entries()).map(([month, revenue]) => ({
    month,
    revenue
  }));
  
  // Count payment methods
  const paymentMethodDistribution: Record<string, number> = {};
  
  activeTickets.forEach(ticket => {
    const method = ticket.payment_method || 'unknown';
    paymentMethodDistribution[method] = (paymentMethodDistribution[method] || 0) + 1;
  });
  
  // Count item types
  const itemTypeDistribution: Record<string, number> = {};
  
  // Count valet tickets
  activeTickets.forEach(ticket => {
    if (ticket.valet_quantity && ticket.valet_quantity > 0) {
      itemTypeDistribution['Valet'] = (itemTypeDistribution['Valet'] || 0) + ticket.valet_quantity;
    }
  });
  
  // Count dry cleaning items
  dryCleaningItems.forEach(item => {
    const itemName = item.name || 'Unknown Item';
    itemTypeDistribution[itemName] = (itemTypeDistribution[itemName] || 0) + (item.quantity || 1);
  });
  
  // Count additional metrics
  const freeValets = activeTickets.reduce((sum, ticket) => {
    // If the ticket was paid with free valets
    if (ticket.payment_method === 'free_valet') {
      return sum + (ticket.valet_quantity || 1);
    }
    return sum;
  }, 0);
  
  const paidTickets = activeTickets.filter(t => t.is_paid).length;
  
  return {
    totalTickets,
    averageTicketValue,
    totalRevenue,
    ticketsByStatus,
    revenueByMonth,
    itemTypeDistribution,
    paymentMethodDistribution,
    freeValets,
    paidTickets
  };
};
