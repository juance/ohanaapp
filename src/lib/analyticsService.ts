
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TicketAnalytics {
  totalTickets: number;
  averageTicketValue: number;
  totalRevenue: number;
  itemTypeDistribution: Record<string, number>;
  paymentMethodDistribution: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

export const getTicketAnalytics = async (
  startDate?: Date, 
  endDate?: Date
): Promise<TicketAnalytics> => {
  try {
    // Default to last 90 days if no date range provided
    const start = startDate ? startDate : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const end = endDate ? endDate : new Date();
    
    // Get all tickets in date range
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        id, 
        total, 
        payment_method, 
        status, 
        date,
        dry_cleaning_items (name, quantity)
      `)
      .gte('date', start.toISOString())
      .lte('date', endDate ? end.toISOString() : new Date().toISOString());
    
    if (ticketsError) throw ticketsError;
    
    // Calculate metrics
    const totalTickets = tickets.length;
    const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.total || 0), 0);
    const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;
    
    // Distribution by payment method
    const paymentMethodDistribution: Record<string, number> = {};
    tickets.forEach(ticket => {
      const method = ticket.payment_method;
      paymentMethodDistribution[method] = (paymentMethodDistribution[method] || 0) + 1;
    });
    
    // Distribution by status
    const ticketsByStatus: Record<string, number> = {};
    tickets.forEach(ticket => {
      const status = ticket.status;
      ticketsByStatus[status] = (ticketsByStatus[status] || 0) + 1;
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
    
    // Revenue by month
    const revenueByMonth: { month: string; revenue: number }[] = [];
    const monthlyRevenue: Record<string, number> = {};
    
    tickets.forEach(ticket => {
      const date = new Date(ticket.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + (ticket.total || 0);
    });
    
    // Convert to array for charting
    Object.entries(monthlyRevenue).forEach(([month, revenue]) => {
      revenueByMonth.push({ month, revenue });
    });
    
    // Sort by month chronologically
    revenueByMonth.sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/');
      const [bMonth, bYear] = b.month.split('/');
      const aDate = new Date(Number(aYear), Number(aMonth) - 1);
      const bDate = new Date(Number(bYear), Number(bMonth) - 1);
      return aDate.getTime() - bDate.getTime();
    });
    
    return {
      totalTickets,
      averageTicketValue,
      totalRevenue,
      itemTypeDistribution,
      paymentMethodDistribution,
      ticketsByStatus,
      revenueByMonth
    };
  } catch (error) {
    console.error('Error fetching ticket analytics:', error);
    toast.error("Error", 'Error al obtener análisis de tickets');
    
    // Return default empty values
    return {
      totalTickets: 0,
      averageTicketValue: 0,
      totalRevenue: 0,
      itemTypeDistribution: {},
      paymentMethodDistribution: {},
      ticketsByStatus: {},
      revenueByMonth: []
    };
  }
};
