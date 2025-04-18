
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from '@/lib/types/feedback.types';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { FEEDBACK_STORAGE_KEY } from '@/lib/constants/storageKeys';

// Define SyncableCustomerFeedback type
export interface SyncableCustomerFeedback extends CustomerFeedback {
  pendingSync?: boolean;
  pendingDelete?: boolean;
  synced?: boolean;
}

export const syncFeedback = async (): Promise<number> => {
  try {
    // Get locally stored feedback
    const localFeedback = getFromLocalStorage<SyncableCustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];

    // Handle feedback marked for deletion
    const feedbackToDelete = localFeedback.filter(feedback => feedback.pendingDelete);

    for (const feedback of feedbackToDelete) {
      try {
        const { error } = await supabase
          .from('customer_feedback')
          .delete()
          .eq('id', feedback.id);

        if (error) {
          console.error(`Error deleting feedback ${feedback.id}:`, error);
          continue;
        }

        const index = localFeedback.findIndex(f => f.id === feedback.id);
        if (index !== -1) {
          localFeedback.splice(index, 1);
        }
      } catch (deleteError) {
        console.error(`Error processing delete for feedback ${feedback.id}:`, deleteError);
      }
    }

    // Handle feedback that needs to be synced
    const feedbackToSync = localFeedback.filter(feedback => feedback.pendingSync);

    let syncedCount = 0;

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

        const index = localFeedback.findIndex(f => f.id === feedback.id);
        if (index !== -1) {
          localFeedback[index].pendingSync = false;
        }
        syncedCount++;
      } catch (syncError) {
        console.error(`Error syncing feedback ${feedback.id}:`, syncError);
      }
    }

    saveToLocalStorage(FEEDBACK_STORAGE_KEY, localFeedback);

    return syncedCount + feedbackToDelete.length;
  } catch (error) {
    console.error('Error syncing feedback:', error);
    return 0;
  }
};
