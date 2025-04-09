
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage } from '../coreUtils';
import { LocalMetrics } from './types';

/**
 * Sync dashboard metrics data with Supabase
 */
export const syncDashboardMetrics = async (): Promise<boolean> => {
  try {
    // Get current date for the metrics record
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Get existing metrics from dashboard_stats
    const { data: existingStats, error: statsError } = await supabase
      .from('dashboard_stats')
      .select('*')
      .eq('stats_date', formattedDate)
      .maybeSingle();
    
    if (statsError) throw statsError;
    
    // Get local data to sync
    const localMetrics = getFromLocalStorage<LocalMetrics>('dashboard_metrics') || {
      daily: {
        salesByHour: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {},
        totalSales: 0,
        valetCount: 0
      },
      weekly: {
        salesByDay: {},
        valetsByDay: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {}
      },
      monthly: {
        salesByWeek: {},
        valetsByWeek: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {}
      }
    };
    
    // Prepare the stats data
    const statsData = {
      daily_sales_by_hour: localMetrics.daily?.salesByHour || {},
      daily_payment_methods: localMetrics.daily?.paymentMethods || {},
      daily_dry_cleaning_items: localMetrics.daily?.dryCleaningItems || {},
      daily_total_sales: localMetrics.daily?.totalSales || 0,
      daily_valet_count: localMetrics.daily?.valetCount || 0,
      weekly_sales_by_day: localMetrics.weekly?.salesByDay || {},
      weekly_valets_by_day: localMetrics.weekly?.valetsByDay || {},
      weekly_payment_methods: localMetrics.weekly?.paymentMethods || {},
      weekly_dry_cleaning_items: localMetrics.weekly?.dryCleaningItems || {},
      monthly_sales_by_week: localMetrics.monthly?.salesByWeek || {},
      monthly_valets_by_week: localMetrics.monthly?.valetsByWeek || {},
      monthly_payment_methods: localMetrics.monthly?.paymentMethods || {},
      monthly_dry_cleaning_items: localMetrics.monthly?.dryCleaningItems || {}
    };
    
    // Upsert dashboard stats
    if (existingStats) {
      const { error: updateError } = await supabase
        .from('dashboard_stats')
        .update({
          stats_data: statsData
        })
        .eq('id', existingStats.id);
      
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('dashboard_stats')
        .insert({
          stats_date: formattedDate,
          stats_data: statsData
        });
      
      if (insertError) throw insertError;
    }
    
    console.log('Dashboard metrics synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing dashboard metrics:', error);
    return false;
  }
};
