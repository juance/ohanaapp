
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { LocalMetrics } from '@/lib/types';

/**
 * Sync metrics data
 */
export const syncMetricsData = async (): Promise<boolean> => {
  try {
    // Get local metrics data
    const localMetrics = getFromLocalStorage<LocalMetrics[]>('metrics_data') || [];
    
    // Process unsynced metrics
    for (const metric of localMetrics) {
      if (metric.pendingSync) {
        const { error } = await supabase
          .from('dashboard_stats')
          .insert({
            stats_data: metric.data,
            stats_date: metric.date
          });
        
        if (error) throw error;
        
        // Mark as synced
        metric.pendingSync = false;
      }
    }
    
    // Update local storage
    saveToLocalStorage('metrics_data', localMetrics);
    
    console.log('Metrics data synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing metrics data:', error);
    return false;
  }
};
