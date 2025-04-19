
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';

/**
 * Analyze tickets and return statistics
 */
export const analyzeTickets = async (startDate?: string, endDate?: string) => {
  try {
    let query = supabase.from('tickets').select('*');
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      total: data.length,
      delivered: data.filter(ticket => ticket.status === 'delivered').length,
      pending: data.filter(ticket => ticket.status !== 'delivered').length,
      revenue: data.reduce((sum, ticket) => sum + (ticket.total || 0), 0),
    };
  } catch (error) {
    console.error('Error analyzing tickets:', error);
    throw error;
  }
};

/**
 * Analyze customers and return statistics
 */
export const analyzeCustomers = async () => {
  try {
    const { data, error } = await supabase.from('customers').select('*');
    
    if (error) throw error;
    
    return {
      total: data.length,
      withLoyaltyPoints: data.filter(customer => (customer.loyalty_points || 0) > 0).length,
      averagePoints: data.length ? 
        data.reduce((sum, customer) => sum + (customer.loyalty_points || 0), 0) / data.length : 0,
    };
  } catch (error) {
    console.error('Error analyzing customers:', error);
    throw error;
  }
};

/**
 * Analyze revenue over time
 */
export const analyzeRevenue = async (period: 'day' | 'week' | 'month' = 'day') => {
  try {
    const { data, error } = await supabase.from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Group by period
    const periodData = {};
    
    data.forEach(ticket => {
      const date = new Date(ticket.created_at);
      let periodKey;
      
      if (period === 'day') {
        periodKey = date.toISOString().split('T')[0];
      } else if (period === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
      } else if (period === 'month') {
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!periodData[periodKey]) {
        periodData[periodKey] = 0;
      }
      
      periodData[periodKey] += ticket.total || 0;
    });
    
    return Object.entries(periodData).map(([period, amount]) => ({
      period,
      amount: amount as number
    }));
  } catch (error) {
    console.error('Error analyzing revenue:', error);
    throw error;
  }
};

/**
 * Get client visit frequency
 */
export const getClientVisitFrequency = async () => {
  try {
    const { data, error } = await supabase.from('tickets')
      .select('*, customers!inner(id, name, phone)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Group by customer
    const customerVisits = {};
    
    data.forEach(ticket => {
      const customerId = ticket.customer_id;
      
      if (!customerId) return;
      
      if (!customerVisits[customerId]) {
        customerVisits[customerId] = {
          customer: ticket.customers,
          visits: [],
        };
      }
      
      customerVisits[customerId].visits.push(ticket.created_at);
    });
    
    return Object.values(customerVisits).map((data: any) => ({
      customer: data.customer,
      visitCount: data.visits.length,
      lastVisit: data.visits[0],
    }));
  } catch (error) {
    console.error('Error getting client visit frequency:', error);
    throw error;
  }
};
