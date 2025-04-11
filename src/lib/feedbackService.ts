
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from './data/coreUtils';
import { CustomerFeedback } from '@/lib/types';

const FEEDBACK_STORAGE_KEY = 'customer_feedback';

interface FeedbackInput {
  customerName: string;
  rating: number;
  comment: string;
  pendingSync?: boolean;
}

/**
 * Add customer feedback to Supabase
 */
export const addFeedback = async (feedback: FeedbackInput): Promise<boolean> => {
  try {
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
    console.error('Error adding feedback to Supabase:', error);

    // Fallback to localStorage
    try {
      // Get existing feedback
      const localFeedback: CustomerFeedback[] = getFromLocalStorage<CustomerFeedback>(FEEDBACK_STORAGE_KEY);

      // Create new feedback item
      const newFeedback: CustomerFeedback = {
        id: crypto.randomUUID(),
        customerName: feedback.customerName,
        rating: feedback.rating,
        comment: feedback.comment,
        createdAt: new Date().toISOString(),
        pendingSync: true
      };

      // Add to array and save
      localFeedback.push(newFeedback);
      saveToLocalStorage(FEEDBACK_STORAGE_KEY, localFeedback);
      return true;
    } catch (localError) {
      console.error('Error saving feedback to localStorage:', localError);
      return false;
    }
  }
};

/**
 * Get all feedback from Supabase
 */
export const getFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    const { data: feedbackItems, error } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map Supabase data to our application model
    const mappedFeedback: CustomerFeedback[] = feedbackItems.map(item => ({
      id: item.id,
      customerName: item.customer_name,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at,
      pendingSync: false
    }));

    return mappedFeedback;
  } catch (error) {
    console.error('Error retrieving feedback from Supabase:', error);

    // Fallback to localStorage
    const localFeedback: CustomerFeedback[] = getFromLocalStorage<CustomerFeedback>(FEEDBACK_STORAGE_KEY);
    return localFeedback;
  }
};

/**
 * Delete feedback from Supabase
 */
export const deleteFeedback = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('customer_feedback')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting feedback from Supabase:', error);

    // Try to delete from local storage if it exists there
    try {
      const localFeedback: CustomerFeedback[] = getFromLocalStorage<CustomerFeedback>(FEEDBACK_STORAGE_KEY);

      const updatedFeedback = localFeedback.filter(item => item.id !== id);
      saveToLocalStorage(FEEDBACK_STORAGE_KEY, updatedFeedback);
      return true;
    } catch (localError) {
      console.error('Error deleting feedback from localStorage:', localError);
      return false;
    }
  }
};
