
import { getFromLocalStorage, saveToLocalStorage } from './data/coreUtils';
import { CustomerFeedback } from './types';
import { supabase } from '@/integrations/supabase/client';

// Define storage key
const FEEDBACK_STORAGE_KEY = 'feedback_data';

/**
 * Get all feedback from Supabase
 */
export const getFeedbackFromServer = async (): Promise<CustomerFeedback[]> => {
  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map(item => ({
      id: item.id,
      customerName: item.customer_name,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at,
    }));
  } catch (error) {
    console.error('Error getting feedback from server:', error);
    return [];
  }
};

/**
 * Store customer feedback in local storage and eventually sync to Supabase
 */
export const storeCustomerFeedback = async (feedback: Omit<CustomerFeedback, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    // Create a complete feedback object
    const newFeedback: CustomerFeedback = {
      id: crypto.randomUUID(),
      ...feedback,
      createdAt: new Date().toISOString(),
      pendingSync: true
    };
    
    // Get existing feedback
    const existingFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    
    // Add new feedback
    existingFeedback.push(newFeedback);
    
    // Save back to storage
    saveToLocalStorage(FEEDBACK_STORAGE_KEY, existingFeedback);
    
    return true;
  } catch (error) {
    console.error('Error storing customer feedback:', error);
    return false;
  }
};

/**
 * Get all feedback, combining local and server data
 */
export const getAllFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    // Get server feedback
    const serverFeedback = await getFeedbackFromServer();
    
    // Get local feedback
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    
    // Combine and flatten the results, removing duplicates by ID
    const feedbackMap = new Map<string, CustomerFeedback>();
    
    // Process server feedback first
    serverFeedback.forEach(feedback => {
      feedbackMap.set(feedback.id, feedback);
    });
    
    // Then process local feedback, which will override server feedback if IDs match
    localFeedback.forEach(feedback => {
      feedbackMap.set(feedback.id, feedback);
    });
    
    // Convert map back to array
    const combinedFeedback: CustomerFeedback[] = Array.from(feedbackMap.values());
    
    // Sort by createdAt, most recent first
    return combinedFeedback.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error('Error getting all feedback:', error);
    return [];
  }
};

/**
 * Get average rating from all feedback
 */
export const getAverageRating = async (): Promise<number> => {
  try {
    const allFeedback = await getAllFeedback();
    
    if (allFeedback.length === 0) return 0;
    
    const sum = allFeedback.reduce((acc, feedback) => acc + feedback.rating, 0);
    return sum / allFeedback.length;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return 0;
  }
};

/**
 * Get feedback for display in the UI
 */
export const getFeedback = async (): Promise<CustomerFeedback[]> => {
  return getAllFeedback();
};

/**
 * Add new feedback
 */
export const addFeedback = async (feedbackData: Omit<CustomerFeedback, 'id' | 'createdAt'>): Promise<boolean> => {
  return storeCustomerFeedback(feedbackData);
};

/**
 * Delete feedback by ID
 */
export const deleteFeedback = async (id: string): Promise<boolean> => {
  try {
    // Get existing feedback
    const existingFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
    
    // Filter out the feedback to delete
    const updatedFeedback = existingFeedback.filter(item => item.id !== id);
    
    // Also delete from Supabase if possible
    try {
      await supabase.from('customer_feedback').delete().eq('id', id);
    } catch (serverError) {
      console.warn('Could not delete feedback from server:', serverError);
      // Continue with local deletion even if server deletion fails
    }
    
    // Save back to storage
    saveToLocalStorage(FEEDBACK_STORAGE_KEY, updatedFeedback);
    
    return true;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return false;
  }
};
