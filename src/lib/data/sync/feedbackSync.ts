
import { supabase } from '@/integrations/supabase/client';
import { SyncableCustomerFeedback } from '@/lib/types/sync.types';

/**
 * Sync feedback data with server
 */
export const syncFeedback = async (feedbackItems: SyncableCustomerFeedback[] = []): Promise<number> => {
  try {
    let syncedCount = 0;
    let deletedCount = 0;
    
    if (!Array.isArray(feedbackItems) || feedbackItems.length === 0) {
      return 0;
    }
    
    // Filter items that need syncing or deletion
    const pendingSyncItems = feedbackItems.filter(item => item.pendingSync && !item.pendingDelete);
    const pendingDeleteItems = feedbackItems.filter(item => item.pendingDelete);
    
    // Handle items to delete
    for (const item of pendingDeleteItems) {
      try {
        const { error } = await supabase
          .from('customer_feedback')
          .delete()
          .eq('id', item.id);
          
        if (error) {
          console.error('Error deleting feedback:', error);
          continue;
        }
        
        deletedCount++;
      } catch (deleteError) {
        console.error('Error during feedback deletion:', deleteError);
      }
    }
    
    // Handle items to sync
    for (const item of pendingSyncItems) {
      try {
        const { error } = await supabase
          .from('customer_feedback')
          .insert({
            id: item.id,
            customer_name: item.customerName, // Use customerName instead of customer_name
            rating: item.rating,
            comment: item.comment,
            created_at: item.createdAt, // Use createdAt instead of created_at
            source: item.source || 'app'
          });
          
        if (error) {
          console.error('Error syncing feedback:', error);
          continue;
        }
        
        syncedCount++;
        item.pendingSync = false;
      } catch (syncError) {
        console.error('Error during feedback sync:', syncError);
      }
    }
    
    return syncedCount + deletedCount;
  } catch (error) {
    console.error('Error in syncFeedback:', error);
    return 0;
  }
};
