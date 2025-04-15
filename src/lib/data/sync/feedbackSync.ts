
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';

const FEEDBACK_STORAGE_KEY = 'customer_feedback';

/**
 * Sync local feedback data with Supabase
 *
 * This function handles both uploading new feedback and deleting feedback
 * that was marked for deletion while offline.
 */
export const syncFeedbackData = async (): Promise<number> => {
  let syncedCount = 0;
  
  try {
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    const pendingDeleteFeedback = localFeedback.filter(feedback => feedback.pendingDelete);
    
    // Process items marked for deletion
    for (const feedback of pendingDeleteFeedback) {
      if (!feedback) continue;

      // Delete from Supabase
      const { error } = await supabase
        .from('customer_feedback')
        .delete()
        .eq('id', feedback.id);

      if (error) {
        console.error(`Error deleting feedback ${feedback.id}:`, error);
        continue;
      }

      // Count as synced
      syncedCount++;
    }

    // Remove items marked for deletion from local storage
    const updatedFeedback = localFeedback.filter(feedback => feedback && !feedback.pendingDelete);

    // Find feedback with pendingSync flag
    const pendingFeedback = updatedFeedback.filter(feedback => feedback.pendingSync);

    // Upload each pending feedback
    for (const feedback of pendingFeedback) {
      if (!feedback) continue;

      // Insert feedback to Supabase
      const { error } = await supabase
        .from('customer_feedback')
        .insert({
          id: feedback.id,
          customer_name: feedback.customerName,
          rating: feedback.rating,
          comment: feedback.comment,
          created_at: feedback.createdAt
        });

      if (error) {
        console.error(`Error syncing feedback ${feedback.id}:`, error);
        continue;
      }

      // Mark as synced
      feedback.pendingSync = false;
      syncedCount++;
    }

    // Save back to localStorage
    saveToLocalStorage(FEEDBACK_STORAGE_KEY, updatedFeedback);

    return syncedCount;
  } catch (error) {
    console.error('Error syncing feedback:', error);
    return 0;
  }
};

/**
 * Alias for syncFeedbackData for backward compatibility
 */
export const syncFeedback = syncFeedbackData;
