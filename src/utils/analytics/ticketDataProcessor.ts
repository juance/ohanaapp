
import { TicketAnalytics } from '@/lib/analytics/interfaces';

export const processTicketAnalyticsData = (tickets: any[], dryCleaningItems: any[]): TicketAnalytics => {
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.total || 0), 0);
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  const ticketsByStatus = tickets.reduce((acc, ticket) => {
    const status = ticket.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {
    pending: 0,
    processing: 0,
    ready: 0,
    delivered: 0
  });

  const paymentMethodDistribution = tickets.reduce((acc, ticket) => {
    const method = ticket.payment_method || 'No especificado';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const itemTypeDistribution = dryCleaningItems.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const revenueByMonth = tickets.reduce((acc, ticket) => {
    const date = new Date(ticket.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const existing = acc.find(item => item.month === monthKey);
    if (existing) {
      existing.revenue += ticket.total || 0;
    } else {
      acc.push({
        month: monthKey,
        revenue: ticket.total || 0
      });
    }
    
    return acc;
  }, [] as Array<{ month: string; revenue: number }>);

  const freeValets = tickets.filter(ticket => ticket.total === 0 && ticket.valet_quantity > 0).length;
  const paidTickets = tickets.filter(ticket => ticket.is_paid).length;

  return {
    totalTickets,
    averageTicketValue,
    totalRevenue,
    ticketsByStatus,
    topServices: [],
    revenueByMonth,
    itemTypeDistribution,
    paymentMethodDistribution,
    freeValets,
    paidTickets
  };
};
