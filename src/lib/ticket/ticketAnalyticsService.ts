
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '../utils/errorHandling';
import { TicketMetrics } from '../models/ticketModels';
import { format, subDays, subMonths } from 'date-fns';

/**
 * Get metrics for all tickets within a date range
 */
export const getTicketMetrics = async (
  startDate?: Date, 
  endDate?: Date
): Promise<TicketMetrics> => {
  try {
    let query = supabase.from('tickets').select('*', { count: 'exact' });
    
    // Apply date filters if provided
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }
    
    // Exclude canceled tickets
    query = query.eq('is_canceled', false);
    
    const { data: tickets, count, error } = await query;
    
    if (error) throw error;
    
    // Default empty metrics
    const defaultMetrics: TicketMetrics = {
      totalCount: 0,
      pendingCount: 0,
      readyCount: 0,
      deliveredCount: 0,
      totalRevenue: 0,
      averageValue: 0,
      paidCount: 0,
      unpaidCount: 0
    };
    
    // Return default if no tickets
    if (!tickets || tickets.length === 0) {
      return defaultMetrics;
    }
    
    // Calculate metrics
    const totalCount = count || tickets.length;
    const pendingCount = tickets.filter(t => t.status === 'pending').length;
    const readyCount = tickets.filter(t => t.status === 'ready').length;
    const deliveredCount = tickets.filter(t => t.status === 'delivered').length;
    const paidCount = tickets.filter(t => t.is_paid).length;
    const unpaidCount = totalCount - paidCount;
    
    // Calculate revenue metrics
    const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.total || 0), 0);
    const averageValue = totalCount > 0 ? totalRevenue / totalCount : 0;
    
    return {
      totalCount,
      pendingCount,
      readyCount,
      deliveredCount,
      totalRevenue,
      averageValue,
      paidCount,
      unpaidCount
    };
  } catch (error) {
    handleError(error, 'getTicketMetrics', 'Error al obtener métricas de tickets');
    return {
      totalCount: 0,
      pendingCount: 0,
      readyCount: 0,
      deliveredCount: 0,
      totalRevenue: 0,
      averageValue: 0,
      paidCount: 0,
      unpaidCount: 0
    };
  }
};

/**
 * Get daily revenue data for charts
 */
export const getDailyRevenueData = async (days: number = 30): Promise<Array<{ date: string; revenue: number }>> => {
  try {
    const startDate = subDays(new Date(), days);
    
    const { data, error } = await supabase
      .from('tickets')
      .select('date, total')
      .gte('date', startDate.toISOString())
      .eq('is_canceled', false);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Group by date and sum revenue
    const revenueByDate: Record<string, number> = {};
    
    data.forEach(ticket => {
      if (!ticket.date) return;
      
      const dateStr = format(new Date(ticket.date), 'yyyy-MM-dd');
      revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + (ticket.total || 0);
    });
    
    // Convert to array format for charts
    return Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue
    }));
  } catch (error) {
    handleError(error, 'getDailyRevenueData', 'Error al obtener datos de ingresos diarios');
    return [];
  }
};

/**
 * Get payment method distribution for charts
 */
export const getPaymentMethodDistribution = async (): Promise<Array<{ method: string; count: number }>> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('payment_method')
      .eq('is_canceled', false);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Count payment methods
    const methodCounts: Record<string, number> = {};
    
    data.forEach(ticket => {
      if (!ticket.payment_method) return;
      
      const method = ticket.payment_method;
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });
    
    // Convert to array format for charts
    return Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count
    }));
  } catch (error) {
    handleError(error, 'getPaymentMethodDistribution', 'Error al obtener distribución de métodos de pago');
    return [];
  }
};
