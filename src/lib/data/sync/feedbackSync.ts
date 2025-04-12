
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from '@/lib/types';

/**
 * Sync local feedback data with Supabase
 */
export const syncFeedback = async (): Promise<number> => {
  let syncedCount = 0;
  
  try {
    // Get all local feedback
    const localFeedback = getLocalFeedback();
    
    // Find feedback with pendingSync flag
    const pendingFeedback = localFeedback.filter(feedback => feedback.pendingSync);
    
    // Upload each pending feedback
    for (const feedback of pendingFeedback) {
      // Insert feedback to Supabase
      const { error } = await supabase
        .from('feedback')
        .insert({
          customer_name: feedback.customerName,
          rating: feedback.rating,
          comment: feedback.comment,
          created_at: feedback.createdAt
        });
      
      if (error) {
        console.error('Error syncing feedback item:', error);
        continue;
      }
      
      // Mark as synced
      feedback.pendingSync = false;
      syncedCount++;
    }
    
    // Save back to localStorage
    saveLocalFeedback(localFeedback);
    
    return syncedCount;
  } catch (error) {
    console.error('Error syncing feedback:', error);
    return 0;
  }
};

// Helper function to get local feedback from localStorage
const getLocalFeedback = (): CustomerFeedback[] => {
  try {
    const feedbackJson = localStorage.getItem('feedback');
    return feedbackJson ? JSON.parse(feedbackJson) : [];
  } catch (e) {
    console.error('Error parsing local feedback:', e);
    return [];
  }
};

// Helper function to save feedback to localStorage
const saveLocalFeedback = (feedback: CustomerFeedback[]): void => {
  localStorage.setItem('feedback', JSON.stringify(feedback));
};
