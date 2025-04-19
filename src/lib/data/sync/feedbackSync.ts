
import { supabase } from '@/integrations/supabase/client';
import { SyncableCustomerFeedback } from '@/lib/types/sync.types';

// Function to sync customer feedback with the server
export const syncFeedback = async (feedbackItems: SyncableCustomerFeedback[]): Promise<number> => {
  try {
    let syncedCount = 0;
    
    if (!feedbackItems || !Array.isArray(feedbackItems) || feedbackItems.length === 0) {
      return 0;
    }
    
    // Filter feedback items that need to be synced (both created and deleted)
    const feedbackToSync = feedbackItems.filter(item => 
      (item.pendingSync && !item.pendingDelete) || item.pendingDelete
    );
    
    if (feedbackToSync.length === 0) {
      return 0;
    }
    
    // Process each feedback item
    for (const feedback of feedbackToSync) {
      // Handle deleted feedback
      if (feedback.pendingDelete) {
        const { error } = await supabase
          .from('customer_feedback')
          .delete()
          .eq('id', feedback.id);
          
        if (error) {
          console.error('Error deleting feedback:', error);
          continue;
        }
      } 
      // Handle new feedback that needs to be created
      else if (feedback.pendingSync) {
        const { error } = await supabase
          .from('customer_feedback')
          .insert({
            id: feedback.id,
            customer_name: feedback.customerName,
            rating: feedback.rating,
            comment: feedback.comment,
            created_at: feedback.createdAt,
            source: feedback.source || 'admin'
          });
          
        if (error) {
          console.error('Error creating feedback:', error);
          continue;
        }
      }
      
      syncedCount++;
    }
    
    return syncedCount;
  } catch (error) {
    console.error('Error in syncFeedback:', error);
    return 0;
  }
};
