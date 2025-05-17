
import { supabase } from '@/integrations/supabase/client';

/**
 * Get revenue data by day for specified number of days
 */
export const getRevenueByDay = async (days: number = 30): Promise<Array<{ date: string; amount: number }>> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('date, total')
      .gte('date', startDate.toISOString())
      .eq('is_canceled', false);
      
    if (error) throw error;
    
    const revenueByDay: Record<string, number> = {};
    
    tickets?.forEach(ticket => {
      if (!ticket.date) return;
      
      const dateStr = new Date(ticket.date).toISOString().split('T')[0];
      revenueByDay[dateStr] = (revenueByDay[dateStr] || 0) + Number(ticket.total || 0);
    });
    
    return Object.entries(revenueByDay).map(([date, amount]) => ({ 
      date, 
      amount 
    }));
  } catch (error) {
    console.error('Error fetching revenue by day:', error);
    return [];
  }
};

/**
 * Get payment method distribution
 */
export const getPaymentMethodDistribution = async (): Promise<Array<{ method: string; count: number }>> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('payment_method')
      .eq('is_canceled', false);
      
    if (error) throw error;
    
    const methodCounts: Record<string, number> = {};
    
    data?.forEach(ticket => {
      if (!ticket.payment_method) return;
      
      methodCounts[ticket.payment_method] = (methodCounts[ticket.payment_method] || 0) + 1;
    });
    
    return Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count
    }));
  } catch (error) {
    console.error('Error fetching payment method distribution:', error);
    return [];
  }
};
