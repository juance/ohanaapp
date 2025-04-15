
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';

// Constante para la clave de almacenamiento
const FEEDBACK_STORAGE_KEY = 'customerFeedback';

/**
 * Syncs feedback data with the Supabase backend
 * @returns The number of records synced
 */
export const syncFeedback = async (): Promise<number> => {
  try {
    // Get locally stored feedback
    const localFeedback: CustomerFeedback[] = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    
    // Handle feedback marked for deletion
    const feedbackToDelete = localFeedback.filter(feedback => feedback.pendingDelete);
    
    for (const feedback of feedbackToDelete) {
      try {
        // Send delete request to Supabase
        const { error } = await supabase
          .from('customer_feedback')
          .delete()
          .eq('id', feedback.id);
        
        if (error) {
          console.error(`Error deleting feedback ${feedback.id}:`, error);
          continue;
        }
        
        // Remove from local array if successfully deleted
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
        
        // Actualizar el estado local
        const index = localFeedback.findIndex(f => f.id === feedback.id);
        if (index !== -1) {
          localFeedback[index].pendingSync = false;
        }
        syncedCount++;
      } catch (syncError) {
        console.error(`Error syncing feedback ${feedback.id}:`, syncError);
      }
    }
    
    // Save updated local data
    saveToLocalStorage(FEEDBACK_STORAGE_KEY, localFeedback);
    
    return syncedCount + feedbackToDelete.length;
  } catch (error) {
    console.error('Error syncing feedback:', error);
    return 0;
  }
};
