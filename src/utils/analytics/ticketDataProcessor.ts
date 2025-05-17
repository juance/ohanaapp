
type Ticket = {
  id: string;
  total: number;
  payment_method?: string;
  status: string;
  date?: string;
  created_at?: string;
  is_canceled: boolean;
  is_paid: boolean;
  valet_quantity?: number;
};

type DryCleaningItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  ticket_id: string;
};

/**
 * Processes raw ticket data into analytics metrics
 */
export const processTicketAnalyticsData = (
  tickets: Ticket[] = [], 
  dryCleaningItems: DryCleaningItem[] = []
) => {
  // Calculate basic metrics
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, ticket) => sum + (Number(ticket.total) || 0), 0);
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  // Count of free valets
  const freeValets = tickets.filter(ticket => ticket.valet_quantity && ticket.valet_quantity > 0 && ticket.total === 0).length;

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
    const status = ticket.status;
    if (status in ticketsByStatus) {
      ticketsByStatus[status as keyof typeof ticketsByStatus]++;
    }
  });

  // Distribution by payment method
  const paymentMethodDistribution: Record<string, number> = {};
  tickets.forEach(ticket => {
    if (!ticket.payment_method) return;
    
    const method = ticket.payment_method;
    paymentMethodDistribution[method] = (paymentMethodDistribution[method] || 0) + 1;
  });

  // Item type distribution
  const itemTypeDistribution: Record<string, number> = {};
  dryCleaningItems.forEach((item) => {
    const itemName = item.name;
    itemTypeDistribution[itemName] = (itemTypeDistribution[itemName] || 0) + (item.quantity || 1);
  });

  // Top services analysis
  const servicesMap = new Map<string, number>();

  // Add dry cleaning items to services map
  dryCleaningItems.forEach((item) => {
    servicesMap.set(item.name, (servicesMap.get(item.name) || 0) + (item.quantity || 1));
  });

  // Add valet tickets to services map
  tickets.forEach(ticket => {
    if (ticket.valet_quantity && ticket.valet_quantity > 0) {
      servicesMap.set('Valet', (servicesMap.get('Valet') || 0) + ticket.valet_quantity);
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
};
