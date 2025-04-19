
import { supabase } from '@/integrations/supabase/client';
import { SyncableCustomerFeedback } from '@/lib/types';

// Function to sync feedback with the server
export const syncFeedback = async (feedbackItems: SyncableCustomerFeedback[]): Promise<number> => {
  try {
    let syncedCount = 0;
    
    if (!feedbackItems || !Array.isArray(feedbackItems) || feedbackItems.length === 0) {
      return 0;
    }
    
    // Process items to delete
    const itemsToDelete = feedbackItems.filter(item => item.pendingDelete);
    
    for (const item of itemsToDelete) {
      // Delete from Supabase
      const { error } = await supabase
        .from('customer_feedback')
        .delete()
        .eq('id', item.id);
      
      if (error) {
        console.error('Error deleting feedback:', error);
        continue;
      }
      
      syncedCount++;
    }
    
    // Process items to sync
    const itemsToSync = feedbackItems.filter(item => item.pendingSync && !item.pendingDelete);
    
    for (const item of itemsToSync) {
      // Check if item exists
      const { data: existingData, error: checkError } = await supabase
        .from('customer_feedback')
        .select('id')
        .eq('id', item.id);
      
      if (checkError) {
        console.error('Error checking feedback existence:', checkError);
        continue;
      }
      
      let success = false;
      
      if (existingData && existingData.length > 0) {
        // Update existing item
        const { error: updateError } = await supabase
          .from('customer_feedback')
          .update({
            id: item.id,
            customer_name: item.customerName,
            rating: item.rating,
            comment: item.comment,
            created_at: item.createdAt,
            source: 'admin' // Default source
          })
          .eq('id', item.id);
        
        success = !updateError;
        
        if (updateError) {
          console.error('Error updating feedback:', updateError);
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('customer_feedback')
          .insert({
            id: item.id,
            customer_name: item.customerName,
            rating: item.rating,
            comment: item.comment,
            created_at: item.createdAt,
            source: 'admin' // Default source
          });
        
        success = !insertError;
        
        if (insertError) {
          console.error('Error inserting feedback:', insertError);
        }
      }
      
      if (success) {
        // Mark as synced
        item.pendingSync = false;
        item.synced = true;
        syncedCount++;
      }
    }
    
    return syncedCount;
  } catch (error) {
    console.error('Error in syncFeedback:', error);
    return 0;
  }
};
