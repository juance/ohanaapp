
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { CustomerFeedback } from '@/lib/types';
import { handleError } from '@/lib/utils/errorHandling';

/**
 * Sync feedback data
 */
export const syncFeedbackData = async (): Promise<boolean> => {
  try {
    // Get local feedback data
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>('customer_feedback') || [];

    // Process any unsynced feedback
    for (const feedback of localFeedback) {
      if (feedback.pendingSync) {
        const { error: feedbackError } = await supabase
          .from('customer_feedback')
          .insert({
            customer_name: feedback.customerName,
            rating: feedback.rating,
            comment: feedback.comment,
            created_at: feedback.createdAt
          });

        if (feedbackError) throw feedbackError;

        // Mark as synced
        feedback.pendingSync = false;
      }
    }

    // Update local storage
    saveToLocalStorage('customer_feedback', localFeedback);

    console.log('Feedback data synced successfully');
    return true;
  } catch (error) {
    handleError(error, 'syncFeedbackData', 'Error al sincronizar comentarios', false);
    return false;
  }
};
