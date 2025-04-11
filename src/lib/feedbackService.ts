
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from './data/coreUtils';
import { CustomerFeedback } from '@/lib/types';
import { handleError } from './utils/errorHandling';
import { validateFeedback } from './validationService';

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
    // Validate feedback data
    const validation = validateFeedback(feedback);
    if (!validation.isValid) {
      throw new Error("Datos de feedback inválidos");
    }

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
    handleError(error, 'addFeedback', 'Error al guardar el comentario', false);

    // Fallback to localStorage
    try {
      // Get existing feedback
      const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];

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
      handleError(localError, 'addFeedbackToLocalStorage', 'Error al guardar comentario localmente', false);
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
    handleError(error, 'getFeedback', 'Error al obtener comentarios', false);

    // Fallback to localStorage
    const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
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
    handleError(error, 'deleteFeedback', 'Error al eliminar comentario', false);

    // Try to delete from local storage if it exists there
    try {
      const localFeedback = getFromLocalStorage<CustomerFeedback[]>(FEEDBACK_STORAGE_KEY) || [];
      const updatedFeedback = localFeedback.filter(item => item.id !== id);
      saveToLocalStorage(FEEDBACK_STORAGE_KEY, updatedFeedback);
      return true;
    } catch (localError) {
      handleError(localError, 'deleteFeedbackFromLocalStorage', 'Error al eliminar comentario localmente', false);
      return false;
    }
  }
};
