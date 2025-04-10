
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from './types';
import { getFromLocalStorage, saveToLocalStorage } from './data/coreUtils';

// Local storage key for feedback
const FEEDBACK_STORAGE_KEY = 'feedback_data';

/**
 * Store customer feedback
 */
export const storeFeedback = async (feedback: Omit<CustomerFeedback, 'id' | 'createdAt' | 'pendingSync'>): Promise<CustomerFeedback> => {
  const newFeedback: CustomerFeedback = {
    id: crypto.randomUUID(),
    customerName: feedback.customerName,
    rating: feedback.rating,
    comment: feedback.comment,
    createdAt: new Date().toISOString(),
    pendingSync: true
  };

  try {
    // Try to store in Supabase
    const { error } = await supabase
      .from('customer_feedback')
      .insert({
        customer_name: newFeedback.customerName,
        rating: newFeedback.rating,
        comment: newFeedback.comment
      });

    // If error, store locally for later sync
    if (error) {
      console.error('Error storing feedback in Supabase:', error);
      storeLocalFeedback(newFeedback);
      return newFeedback;
    }

    // If successful, don't mark as pending sync
    newFeedback.pendingSync = false;
    return newFeedback;
  } catch (e) {
    // In case of network errors, store locally
    console.error('Network error storing feedback:', e);
    storeLocalFeedback(newFeedback);
    return newFeedback;
  }
};

/**
 * Store feedback locally for later sync
 */
const storeLocalFeedback = (feedback: CustomerFeedback): void => {
  // Get existing local feedback
  const existingFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
  
  // Add new feedback
  existingFeedback.push(feedback);
  
  // Store updated array
  saveToLocalStorage(FEEDBACK_STORAGE_KEY, existingFeedback);
};

/**
 * Fetch all customer feedback
 */
export const getAllFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform data to match our application model
    const feedbackData: CustomerFeedback[] = (data || []).map(item => ({
      id: item.id,
      customerName: item.customer_name,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at,
      pendingSync: false
    }));
    
    // Also get locally stored feedback
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    
    // Return combined results with local feedback first (they're newer)
    return [...localFeedback, ...feedbackData];
  } catch (error) {
    console.error('Error fetching feedback:', error);
    
    // On error, return only local feedback
    return getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
  }
};

/**
 * Delete customer feedback
 */
export const deleteFeedback = async (feedbackId: string): Promise<boolean> => {
  try {
    // First try to delete from local storage
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    const feedbackIndex = localFeedback.findIndex(f => f.id === feedbackId);
    
    if (feedbackIndex >= 0) {
      // Remove from local array
      localFeedback.splice(feedbackIndex, 1);
      saveToLocalStorage(FEEDBACK_STORAGE_KEY, localFeedback);
      
      // If it was only stored locally, we're done
      if (localFeedback[feedbackIndex]?.pendingSync) {
        return true;
      }
    }
    
    // If not found locally or it was synced, try to delete from Supabase
    const { error } = await supabase
      .from('customer_feedback')
      .delete()
      .eq('id', feedbackId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return false;
  }
};

// Add aliases for backward compatibility
export const addFeedback = storeFeedback;
export const getFeedback = getAllFeedback;
