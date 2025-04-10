
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage } from './data/coreUtils';

const FEEDBACK_STORAGE_KEY = 'customer_feedback';

/**
 * Add a new customer feedback
 */
export const addFeedback = async (feedback: Omit<CustomerFeedback, 'id' | 'createdAt' | 'pendingSync'>): Promise<boolean> => {
  try {
    // First, try to add to Supabase
    const { error } = await supabase
      .from('customer_feedback')
      .insert({
        customer_name: feedback.customerName,
        rating: feedback.rating,
        comment: feedback.comment
      });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding feedback to Supabase, saving locally:', error);
    
    // Fallback to localStorage
    try {
      const newFeedback: CustomerFeedback = {
        id: crypto.randomUUID(),
        customerName: feedback.customerName,
        rating: feedback.rating,
        comment: feedback.comment,
        createdAt: new Date().toISOString(),
        pendingSync: true
      };
      
      // Get existing feedback
      const existingFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
      
      // Add new feedback to the array
      existingFeedback.push(newFeedback);
      
      // Save updated feedback array
      saveToLocalStorage(FEEDBACK_STORAGE_KEY, existingFeedback);
      
      return true;
    } catch (localError) {
      console.error('Error saving feedback to localStorage:', localError);
      return false;
    }
  }
};

/**
 * Get all customer feedback
 */
export const getFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    // First try to get from Supabase
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Map data to match our application's structure
    const feedbackList: CustomerFeedback[] = data.map((item: any) => ({
      id: item.id,
      customerName: item.customer_name,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at
    }));
    
    // Get any locally stored feedback
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    
    // Combine both sources, with local feedback first (usually newer)
    return [...localFeedback, ...feedbackList];
  } catch (error) {
    console.error('Error getting feedback from Supabase, using local only:', error);
    
    // Fallback to localStorage
    return getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
  }
};

/**
 * Delete a feedback item
 */
export const deleteFeedback = async (feedbackId: string): Promise<boolean> => {
  try {
    // First try to delete from Supabase
    const { error } = await supabase
      .from('customer_feedback')
      .delete()
      .eq('id', feedbackId);
      
    if (error) throw error;
    
    // Also remove from local storage if it exists there
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    const updatedFeedback = localFeedback.filter(feedback => feedback.id !== feedbackId);
    saveToLocalStorage(FEEDBACK_STORAGE_KEY, updatedFeedback);
    
    return true;
  } catch (error) {
    console.error('Error deleting feedback from Supabase:', error);
    
    // If Supabase fails, try to remove from localStorage
    try {
      const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
      const updatedFeedback = localFeedback.filter(feedback => feedback.id !== feedbackId);
      saveToLocalStorage(FEEDBACK_STORAGE_KEY, updatedFeedback);
      
      return true;
    } catch (localError) {
      console.error('Error removing feedback from localStorage:', localError);
      return false;
    }
  }
};
