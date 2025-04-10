
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { CustomerFeedback } from '../../types';

/**
 * Sync customer feedback data
 */
export const syncFeedbackData = async (): Promise<boolean> => {
  try {
    // Get local feedback data
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>('feedback_data') || [];
    
    // Process any unsynced feedback
    for (const feedback of localFeedback) {
      if (feedback.pendingSync) {
        // Insert feedback to Supabase
        const { error } = await supabase
          .from('customer_feedback')
          .insert({
            customer_name: feedback.customerName,
            rating: feedback.rating,
            comment: feedback.comment,
            created_at: feedback.createdAt || new Date().toISOString()
          });
        
        if (error) throw error;
        
        // Mark as synced
        feedback.pendingSync = false;
      }
    }
    
    // Update local storage
    saveToLocalStorage('feedback_data', localFeedback);
    
    console.log('Feedback data synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing feedback data:', error);
    return false;
  }
};
