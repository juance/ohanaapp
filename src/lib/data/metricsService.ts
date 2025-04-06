
import { supabase } from '@/integrations/supabase/client';
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';

// Instead of using a non-existent RPC function, we'll query the database directly
export const getMetrics = async (): Promise<{ daily: DailyMetrics, weekly: WeeklyMetrics, monthly: MonthlyMetrics }> => {
  try {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    
    // Transform the data to match our metrics structure
    return {
      daily: {
        total: data.daily_total || 0,
        ticketCount: data.daily_ticket_count || 0,
        salesByHour: data.daily_sales_by_hour || {},
        paymentMethods: data.daily_payment_methods || {},
        dryCleaningItems: data.daily_dry_cleaning_items || {}
      },
      weekly: {
        total: data.weekly_total || 0,
        ticketCount: data.weekly_ticket_count || 0,
        salesByDay: data.weekly_sales_by_day || {},
        paymentMethods: data.weekly_payment_methods || {},
        dryCleaningItems: data.weekly_dry_cleaning_items || {}
      },
      monthly: {
        total: data.monthly_total || 0,
        ticketCount: data.monthly_ticket_count || 0,
        salesByWeek: data.monthly_sales_by_week || {},
        paymentMethods: data.monthly_payment_methods || {},
        dryCleaningItems: data.monthly_dry_cleaning_items || {}
      }
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    
    // Return default metrics if there's an error
    return {
      daily: {
        total: 0,
        ticketCount: 0,
        salesByHour: {},
        paymentMethods: {},
        dryCleaningItems: {}
      },
      weekly: {
        total: 0,
        ticketCount: 0,
        salesByDay: {},
        paymentMethods: {},
        dryCleaningItems: {}
      },
      monthly: {
        total: 0,
        ticketCount: 0,
        salesByWeek: {},
        paymentMethods: {},
        dryCleaningItems: {}
      }
    };
  }
};
