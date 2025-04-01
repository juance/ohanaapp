
import { supabase } from '@/integrations/supabase/client';
import { TicketAnalytics, DateRange } from './types';

export async function fetchTicketAnalytics(dateRange: DateRange): Promise<TicketAnalytics> {
  // Get tickets within date range from Supabase
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
  }

  // Calculate metrics
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, ticket) => sum + (Number(ticket.total) || 0), 0);
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  // Count of free valets
  const freeValets = tickets.filter(ticket => ticket.valet_quantity > 0 && ticket.total === 0).length;
  
  // Count of paid tickets
  const paidTickets = tickets.filter(ticket => ticket.is_paid).length;

  // Distribution by status
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

  // Distribution by payment method
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

  // Top services analysis
  const servicesMap = new Map<string, number>();
  tickets.forEach(ticket => {
    if (ticket.dry_cleaning_items && Array.isArray(ticket.dry_cleaning_items)) {
      ticket.dry_cleaning_items.forEach((item: any) => {
        servicesMap.set(item.name, (servicesMap.get(item.name) || 0) + (item.quantity || 1));
      });
    } else {
      // Handle valet tickets
      servicesMap.set('Valet', (servicesMap.get('Valet') || 0) + 1);
    }
  });

  const topServices = Array.from(servicesMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Revenue by month
  const revenueByMonthMap = new Map<string, number>();
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  tickets.forEach(ticket => {
    if (!ticket.date) return;
    const date = new Date(ticket.date);
    const monthKey = months[date.getMonth()];
    revenueByMonthMap.set(monthKey, (revenueByMonthMap.get(monthKey) || 0) + Number(ticket.total || 0));
  });

  const revenueByMonth = Array.from(revenueByMonthMap.entries())
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => {
      const aIndex = months.indexOf(a.month);
      const bIndex = months.indexOf(b.month);
      return aIndex - bIndex;
    });

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
}
