
import { getFromLocalStorage, saveToLocalStorage } from './data/coreUtils';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from './types';

const FEEDBACK_STORAGE_KEY = 'customer_feedback';

/**
 * Get all stored feedback
 */
export const getAllFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map to our application format
    const feedbackData: CustomerFeedback[] = data.map(item => ({
      id: item.id,
      customerName: item.customer_name,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at,
      pendingSync: false
    }));

    // Merge with local feedback
    const localFeedback = getFromLocalStorage<CustomerFeedback>(FEEDBACK_STORAGE_KEY);

    // Combine the two sources (remote and local)
    // Use a Map to handle duplicates (prefer local)
    const feedbackMap = new Map();

    // Add remote data first
    feedbackData.forEach(item => {
      feedbackMap.set(item.id, item);
    });

    // Then add local data, overwriting remote with the same ID
    if (localFeedback && localFeedback.length > 0) {
      localFeedback.forEach(item => {
        if (item && item.id) {
          feedbackMap.set(item.id, item);
        }
      });
    }

    // Convert back to array
    return Array.from(feedbackMap.values());

  } catch (error) {
    console.error('Error retrieving feedback from Supabase:', error);

    // Fallback to local storage
    return getFromLocalStorage<CustomerFeedback>(FEEDBACK_STORAGE_KEY) || [];
  }
};

/**
 * Add new feedback
 */
export const addFeedback = (feedback: Omit<CustomerFeedback, 'id' | 'createdAt' | 'pendingSync'>): CustomerFeedback => {
  const newFeedback: CustomerFeedback = {
    id: uuidv4(),
    customerName: feedback.customerName,
    rating: feedback.rating,
    comment: feedback.comment,
    createdAt: new Date().toISOString(),
    pendingSync: true // Mark for sync
  };

  // Get existing feedback
  const existingFeedback = getFromLocalStorage<CustomerFeedback>(FEEDBACK_STORAGE_KEY) || [];

  // Add new feedback
  existingFeedback.push(newFeedback);

  // Save updated list
  saveToLocalStorage(FEEDBACK_STORAGE_KEY, existingFeedback);

  // Attempt to sync immediately if online
  if (navigator.onLine) {
    supabase
      .from('customer_feedback')
      .insert({
        id: newFeedback.id,
        customer_name: newFeedback.customerName,
        rating: newFeedback.rating,
        comment: newFeedback.comment,
        created_at: newFeedback.createdAt
      })
      .then(({ error }) => {
        if (!error) {
          // Mark as synced in local storage
          const updatedFeedback = getFromLocalStorage<CustomerFeedback>(FEEDBACK_STORAGE_KEY) || [];
          const feedbackIndex = updatedFeedback.findIndex(f => f && f.id === newFeedback.id);
          if (feedbackIndex >= 0) {
            if (updatedFeedback[feedbackIndex]) {
              updatedFeedback[feedbackIndex].pendingSync = false;
            }
            saveToLocalStorage(FEEDBACK_STORAGE_KEY, updatedFeedback);
          }
        }
      });
  }

  return newFeedback;
};

/**
 * Filter feedback by rating (1-5)
 */
export const getFeedbackByRating = async (rating: number): Promise<CustomerFeedback[]> => {
  const allFeedback = await getAllFeedback();
  return allFeedback.filter(item => item.rating === rating);
};

/**
 * Delete feedback by ID
 */
export const deleteFeedback = async (id: string): Promise<boolean> => {
  try {
    // Delete from Supabase if online
    if (navigator.onLine) {
      const { error } = await supabase
        .from('customer_feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }

    // Delete from local storage
    const localFeedback = getFromLocalStorage<CustomerFeedback>(FEEDBACK_STORAGE_KEY) || [];
    const updatedFeedback = localFeedback.filter(item => item && item.id !== id);
    saveToLocalStorage(FEEDBACK_STORAGE_KEY, updatedFeedback);

    return true;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return false;
  }
};

/**
 * Get average rating
 */
export const getAverageRating = async (): Promise<number> => {
  const feedback = await getAllFeedback();

  if (feedback.length === 0) return 0;

  const sum = feedback.reduce((total, item) => total + item.rating, 0);
  return sum / feedback.length;
};

/**
 * Get feedback by ID
 */
export const getFeedbackById = async (id: string): Promise<CustomerFeedback | null> => {
  const feedback = await getAllFeedback();
  const found = feedback.find(item => item.id === id);
  return found || null;
};
