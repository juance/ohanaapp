
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { FEEDBACK_STORAGE_KEY } from '@/lib/constants/storageKeys';

// Define SyncableCustomerFeedback type
export interface SyncableCustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  pendingSync?: boolean;
  synced?: boolean;
  pendingDelete?: boolean;
}

export const syncFeedback = async (): Promise<number> => {
  try {
    // Get locally stored feedback
    const localFeedback = getFromLocalStorage<SyncableCustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    
    // Check if there are feedback items to sync
    const feedbackToSync = localFeedback.filter(fb => fb.pendingSync && !fb.pendingDelete);
    const feedbackToDelete = localFeedback.filter(fb => fb.pendingDelete);
    
    if (feedbackToSync.length === 0 && feedbackToDelete.length === 0) {
      console.log('No feedback to sync');
      return 0;
    }
    
    let syncedCount = 0;
    
    // Process deletions first
    for (const feedback of feedbackToDelete) {
      try {
        const { error } = await supabase
          .from('customer_feedback')
          .delete()
          .eq('id', feedback.id);
        
        if (error) throw error;
        
        // Remove from local storage
        const index = localFeedback.findIndex(fb => fb.id === feedback.id);
        if (index !== -1) {
          localFeedback.splice(index, 1);
        }
        syncedCount++;
      } catch (deletionError) {
        console.error(`Error deleting feedback ${feedback.id}:`, deletionError);
      }
    }
    
    // Then process additions/updates
    for (const feedback of feedbackToSync) {
      try {
        const { error } = await supabase
          .from('customer_feedback')
          .insert({
            id: feedback.id,
            customer_name: feedback.customerName,
            rating: feedback.rating,
            comment: feedback.comment,
            created_at: feedback.createdAt
          });
        
        if (error) throw error;
        
        // Update local state
        const index = localFeedback.findIndex(fb => fb.id === feedback.id);
        if (index !== -1) {
          localFeedback[index].pendingSync = false;
          localFeedback[index].synced = true;
        }
        syncedCount++;
      } catch (feedbackSyncError) {
        console.error(`Error syncing feedback ${feedback.id}:`, feedbackSyncError);
      }
    }
    
    saveToLocalStorage(FEEDBACK_STORAGE_KEY, localFeedback);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing feedback:', error);
    return 0;
  }
};
