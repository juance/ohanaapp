
import { v4 as uuidv4 } from 'uuid';
import { CustomerFeedback } from '@/lib/types';
import { getFeedbackFromStorage, saveFeedbackToStorage } from './storage/feedbackStorageService';
import { getFeedbackFromDb, createFeedbackInDb, deleteFeedbackFromDb } from './db/feedbackDbService';
import { calculateAverageRating, filterFeedbackByRating, findFeedbackById } from './analysis/feedbackAnalysisService';
import { toast } from '@/lib/toast';

export const getAllFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    // Try to get from Supabase first
    const feedbackData = await getFeedbackFromDb();

    // Merge with local feedback
    const localFeedback = getFeedbackFromStorage();

    // Combine the two sources using a Map to handle duplicates (prefer local)
    const feedbackMap = new Map();

    // Add remote data first
    feedbackData.forEach(item => {
      feedbackMap.set(item.id, item);
    });

    // Then add local data, overwriting remote with the same ID
    if (localFeedback.length > 0) {
      localFeedback.forEach(item => {
        if (item && item.id) {
          feedbackMap.set(item.id, item);
        }
      });
    }

    // Convert back to array
    return Array.from(feedbackMap.values());
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    return getFeedbackFromStorage();
  }
};

export const addFeedback = async (
  feedbackData: Omit<CustomerFeedback, 'id' | 'createdAt' | 'pendingSync'>
): Promise<CustomerFeedback> => {
  const newFeedback: CustomerFeedback = {
    id: uuidv4(),
    customerName: feedbackData.customerName,
    rating: feedbackData.rating,
    comment: feedbackData.comment,
    source: feedbackData.source || 'admin',
    createdAt: new Date().toISOString(),
    pendingSync: true
  };

  // Get existing feedback
  const existingFeedback = getFeedbackFromStorage();
  existingFeedback.push(newFeedback);
  saveFeedbackToStorage(existingFeedback);

  // Attempt to sync immediately if online
  if (navigator.onLine) {
    const success = await createFeedbackInDb(newFeedback);
    if (success) {
      const updatedFeedback = getFeedbackFromStorage();
      const feedbackIndex = updatedFeedback.findIndex(f => f.id === newFeedback.id);
      if (feedbackIndex >= 0) {
        updatedFeedback[feedbackIndex].pendingSync = false;
        saveFeedbackToStorage(updatedFeedback);
      }
    }
  }

  return newFeedback;
};

export const deleteFeedback = async (id: string): Promise<boolean> => {
  try {
    const localFeedback = getFeedbackFromStorage();
    const feedbackExists = localFeedback.some(item => item && item.id === id);

    if (!feedbackExists) {
      if (navigator.onLine) {
        return await deleteFeedbackFromDb(id);
      }
      return true;
    }

    if (navigator.onLine) {
      const success = await deleteFeedbackFromDb(id);
      if (!success) {
        const updatedFeedback = localFeedback.map(item => {
          if (item && item.id === id) {
            return { ...item, pendingDelete: true };
          }
          return item;
        });
        saveFeedbackToStorage(updatedFeedback);
        return false;
      }
    } else {
      // If offline, mark for deletion later
      const updatedFeedback = localFeedback.map(item => {
        if (item && item.id === id) {
          return { ...item, pendingDelete: true };
        }
        return item;
      });
      saveFeedbackToStorage(updatedFeedback);
    }

    const filteredFeedback = localFeedback.filter(item => item && item.id !== id);
    saveFeedbackToStorage(filteredFeedback);

    return true;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return false;
  }
};

export const getFeedbackByRating = async (rating: number): Promise<CustomerFeedback[]> => {
  const allFeedback = await getAllFeedback();
  return filterFeedbackByRating(allFeedback, rating);
};

export const getAverageRating = async (): Promise<number> => {
  const feedback = await getAllFeedback();
  return calculateAverageRating(feedback);
};

export const getFeedbackById = async (id: string): Promise<CustomerFeedback | null> => {
  const feedback = await getAllFeedback();
  return findFeedbackById(feedback, id);
};
