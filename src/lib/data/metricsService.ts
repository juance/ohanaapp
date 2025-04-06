
import { supabase } from '@/integrations/supabase/client';
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';

// Default empty payment methods object that matches the required type
const defaultPaymentMethods = {
  cash: 0,
  debit: 0,
  mercadopago: 0,
  cuentaDni: 0
};

// Instead of using a non-existent RPC function, we'll query the database directly
export const getMetrics = async (): Promise<{ daily: DailyMetrics, weekly: WeeklyMetrics, monthly: MonthlyMetrics }> => {
  try {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .order('stats_date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;

    // Extract stats data from the JSON field
    const statsData = data.stats_data || {};
    
    // Transform the data to match our metrics structure
    return {
      daily: {
        salesByHour: statsData.daily_sales_by_hour || {},
        paymentMethods: statsData.daily_payment_methods || defaultPaymentMethods,
        dryCleaningItems: statsData.daily_dry_cleaning_items || {}
      },
      weekly: {
        salesByDay: statsData.weekly_sales_by_day || {},
        paymentMethods: statsData.weekly_payment_methods || defaultPaymentMethods,
        dryCleaningItems: statsData.weekly_dry_cleaning_items || {}
      },
      monthly: {
        salesByWeek: statsData.monthly_sales_by_week || {},
        paymentMethods: statsData.monthly_payment_methods || defaultPaymentMethods,
        dryCleaningItems: statsData.monthly_dry_cleaning_items || {}
      }
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    
    // Return default metrics if there's an error
    return {
      daily: {
        salesByHour: {},
        paymentMethods: defaultPaymentMethods,
        dryCleaningItems: {}
      },
      weekly: {
        salesByDay: {},
        paymentMethods: defaultPaymentMethods,
        dryCleaningItems: {}
      },
      monthly: {
        salesByWeek: {},
        paymentMethods: defaultPaymentMethods,
        dryCleaningItems: {}
      }
    };
  }
};
