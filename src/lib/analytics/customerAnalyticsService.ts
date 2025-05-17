
import { supabase } from '@/integrations/supabase/client';

/**
 * Get customer visit frequency
 */
export const getCustomerVisitFrequency = async (): Promise<Array<{ id: string; name: string; visits: number; lastVisit: string }>> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, valets_count, last_visit')
      .order('valets_count', { ascending: false })
      .limit(50);
      
    if (error) throw error;
    
    return data?.map(customer => ({
      id: customer.id,
      name: customer.name || 'Cliente sin nombre',
      visits: customer.valets_count || 0,
      lastVisit: customer.last_visit || ''
    })) || [];
  } catch (error) {
    console.error('Error fetching customer visit frequency:', error);
    return [];
  }
};

/**
 * Get new customers by month
 */
export const getNewCustomersByMonth = async (months: number = 6): Promise<Array<{ month: string; count: number }>> => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    const { data, error } = await supabase
      .from('customers')
      .select('created_at')
      .gte('created_at', startDate.toISOString());
      
    if (error) throw error;
    
    const customersByMonth: Record<string, number> = {};
    
    data?.forEach(customer => {
      const date = new Date(customer.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      customersByMonth[monthYear] = (customersByMonth[monthYear] || 0) + 1;
    });
    
    return Object.entries(customersByMonth).map(([month, count]) => ({
      month,
      count
    }));
  } catch (error) {
    console.error('Error fetching new customers by month:', error);
    return [];
  }
};
