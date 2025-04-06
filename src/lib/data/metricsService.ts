
import { supabase } from '@/integrations/supabase/client';
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';

// Default empty payment methods object that matches the required type
const defaultPaymentMethods = {
  cash: 0,
  debit: 0,
  mercadopago: 0,
  cuentaDni: 0
};

// Helper function to safely access properties from JSON data
const safeGet = (obj: any, path: string, defaultValue: any = {}) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  // Handle nested paths like 'stats.daily.count'
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || typeof current !== 'object' || !(part in current)) {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current !== undefined ? current : defaultValue;
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
    const statsData = data?.stats_data || {};
    
    // Transform the data to match our metrics structure
    return {
      daily: {
        salesByHour: safeGet(statsData, 'daily_sales_by_hour', {}),
        paymentMethods: safeGet(statsData, 'daily_payment_methods', defaultPaymentMethods),
        dryCleaningItems: safeGet(statsData, 'daily_dry_cleaning_items', {}),
        totalSales: safeGet(statsData, 'daily_total_sales', 0),
        valetCount: safeGet(statsData, 'daily_valet_count', 0)
      },
      weekly: {
        salesByDay: safeGet(statsData, 'weekly_sales_by_day', {}),
        valetsByDay: safeGet(statsData, 'weekly_valets_by_day', {}),
        paymentMethods: safeGet(statsData, 'weekly_payment_methods', defaultPaymentMethods),
        dryCleaningItems: safeGet(statsData, 'weekly_dry_cleaning_items', {})
      },
      monthly: {
        salesByWeek: safeGet(statsData, 'monthly_sales_by_week', {}),
        valetsByWeek: safeGet(statsData, 'monthly_valets_by_week', {}),
        paymentMethods: safeGet(statsData, 'monthly_payment_methods', defaultPaymentMethods),
        dryCleaningItems: safeGet(statsData, 'monthly_dry_cleaning_items', {})
      }
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    
    // Return default metrics if there's an error
    return {
      daily: {
        salesByHour: {},
        paymentMethods: defaultPaymentMethods,
        dryCleaningItems: {},
        totalSales: 0,
        valetCount: 0
      },
      weekly: {
        salesByDay: {},
        valetsByDay: {},
        paymentMethods: defaultPaymentMethods,
        dryCleaningItems: {}
      },
      monthly: {
        salesByWeek: {},
        valetsByWeek: {},
        paymentMethods: defaultPaymentMethods,
        dryCleaningItems: {}
      }
    };
  }
};
