
import { supabase } from '@/integrations/supabase/client';

/**
 * Update dashboard metrics after a ticket is created
 */
export const updateDashboardMetrics = async (data: {
  ticketType: string;
  isPaid: boolean;
  total: number;
  items: any[];
  valetQuantity: number;
  usesFreeValet: boolean;
}) => {
  try {
    // Get current date for grouping metrics
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Get existing stats or create new
    const { data: existingStats, error: fetchError } = await supabase
      .from('dashboard_stats')
      .select('*')
      .eq('stats_date', today)
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    // Prepare stats data
    let statsData: any = existingStats?.stats_data || {
      daily_total_tickets: 0,
      daily_paid_tickets: 0,
      daily_total_revenue: 0,
      daily_sales_by_hour: {},
      daily_valet_count: 0,
      daily_free_valets: 0,
      daily_dry_cleaning_items: {},
      
      weekly_total_tickets: 0,
      weekly_paid_tickets: 0,
      weekly_total_revenue: 0,
      weekly_valets_count: 0,
      weekly_free_valets: 0,
      weekly_dry_cleaning_items: {},
      
      monthly_total_tickets: 0,
      monthly_paid_tickets: 0,
      monthly_total_revenue: 0,
      monthly_valets_count: 0,
      monthly_free_valets: 0,
      monthly_dry_cleaning_items: {}
    };
    
    // Update ticket counts
    statsData.daily_total_tickets += 1;
    statsData.weekly_total_tickets += 1;
    statsData.monthly_total_tickets += 1;
    
    // Update paid ticket counts if applicable
    if (data.isPaid) {
      statsData.daily_paid_tickets += 1;
      statsData.weekly_paid_tickets += 1;
      statsData.monthly_paid_tickets += 1;
    }
    
    // Update revenue if there's a total
    if (data.total > 0) {
      statsData.daily_total_revenue += data.total;
      statsData.weekly_total_revenue += data.total;
      statsData.monthly_total_revenue += data.total;
      
      // Update sales by hour
      const currentHour = now.getHours().toString();
      statsData.daily_sales_by_hour[currentHour] = (statsData.daily_sales_by_hour[currentHour] || 0) + data.total;
    }
    
    // Update valet counts
    if (data.ticketType === 'valet') {
      statsData.daily_valet_count += data.valetQuantity;
      statsData.weekly_valets_count += data.valetQuantity;
      statsData.monthly_valets_count += data.valetQuantity;
      
      // Update free valets count
      if (data.usesFreeValet) {
        statsData.daily_free_valets = (statsData.daily_free_valets || 0) + 1;
        statsData.weekly_free_valets = (statsData.weekly_free_valets || 0) + 1;
        statsData.monthly_free_valets = (statsData.monthly_free_valets || 0) + 1;
      }
    }
    
    // Update dry cleaning items count
    if (data.ticketType === 'tintoreria' && data.items.length > 0) {
      for (const item of data.items) {
        // Update daily counts
        statsData.daily_dry_cleaning_items[item.name] = (statsData.daily_dry_cleaning_items[item.name] || 0) + item.quantity;
        
        // Update weekly counts
        statsData.weekly_dry_cleaning_items[item.name] = (statsData.weekly_dry_cleaning_items[item.name] || 0) + item.quantity;
        
        // Update monthly counts
        statsData.monthly_dry_cleaning_items[item.name] = (statsData.monthly_dry_cleaning_items[item.name] || 0) + item.quantity;
      }
    }
    
    // Save updated stats
    if (existingStats) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('dashboard_stats')
        .update({
          stats_data: statsData
        })
        .eq('id', existingStats.id);
      
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('dashboard_stats')
        .insert({
          stats_date: today,
          stats_data: statsData
        });
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating dashboard metrics:", error);
    return false;
  }
};
